"use strict";

require('dotenv').config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();

const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig[ENV]);

const morgan = (ENV) && require('morgan');
const knexLogger = (ENV) require('knex-logger');

const cookieSession = require("cookie-session");
app.use(cookieSession({
  name: 'session',
  keys: ['secret', 'anothersecret', 'andanothersecret'],
  maxAge: 24 * 60 * 60 * 1000
}));

// Seperated Routes for each Resource
const usersRoutes = require("../routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
(morgan) && app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
(knexLogger) && app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));

// Requirements:
// users should be able to save an external URL along with a title and description
// users should be able to search for already-saved resources created by any user
// users should be able to categorize any resource under a topic
// users should be able to comment on any resource resource.comment
// users should be able to rate any resource
// users should be able to like any resource reactions.liked reactions.rating
// users should be able to view all their own and all liked resources on one page ("My resources")
// users should be able to register, log in, log out and update their profile

// GETS -------------------------------------------------------------------------

app.get("/", (req, res) => {
  if (req.session.userID) {
    res.redirect('/index');
  } else {
    res.redirect('/login');
  }
});
app.get("/index", (req, res) => {
  res.render('index')
})
app.get("/register", (req, res) => {
  if (req.session.userID) {
    res.redirect('/');
  } else {
    res.render('register');
  }
});
app.get("/login", (req, res) => {
  if (req.session.userID) {
    res.redirect('/');
  } else {
    res.render('login');
  }
});
app.get("/profile", (req, res) => {
  if (req.session.userID) {
    knex('users').select('name').where({ id: req.session.userID })
      .then(function (result) {
        res.render('profile', { result });
      })
  } else {
    res.redirect('/');
  }
});
app.get("/myResources", (req, res) => {
  if (req.session.userID) {
    let templateVars = {}
    knex('resources').select().where({ user_id: req.session.userID })
      .then(function (mine) {
        templateVars += mine;
      })
    knex('users').select('*')
      .join('reactions', 'users.id', 'reactions.user_id')
      .join('resources', 'reactions.resource_id', 'resources.id')
      .then(function (liked) {
        this.where('user_id', req.session.userID)
        templateVars += liked;
      })
    res.render('myResources', { templateVars })
  } else {
    res.redirect('/');
  }
});
app.get('/searchResults', (req, res) => {
  if (req.session.userID) {
    if (req.body.name) {
      knex('resources').select().where({ owner_id: req.body.owner }).then(function (result) {
        res.render('/searchResults', { result })
      });
    }
    if (req.body.topic) {
      knex('resources').select().where({ topic_id: req.body.topic }).then(function (result) {
        res.render('/searchResults', { result });
      });
    }
  }
  else {
    res.redirect('/')
  }
})
app.get("/index/:day", (req, res) => {
  knex('days').join('days_topics', 'days.id', 'days_topics.day_id')
    .join('topics', 'days_topics.topic_id', 'topics.id')
    .join('resources_topics', 'topics.id', 'resources_topics.topic_id')
    .then(function (result) {
      res.render('day', { result });
    });
});
app.get("/index/:resourceID", (req, res) => {
  knex('resources').select().where({ id: req.params.resourceID }).then(function (result) {
    res.render('resource', { result });
  })
});

// POSTS -----------------------------------------------------------------------

app.post('/register', (req, res) => {
  const name = req.body.name
  console.log(name)
  if (!name) {
    const templateVars = {
      errCode: 400,
      errMsg: 'missing name'
    }
    res.status(400);
    res.render('error', templateVars);
  }
  else {
    knex('users').insert({ name: req.body.name }).returning(['id'])
      .then(function (result) {
        req.session.userID = result[0].id;
        res.redirect('index')
      })
      .catch(function (error) {
        let templateVars = {
          errCode: 401,
          errMsg: 'name already exists'
        }
        res.status(401);
        res.render('error', templateVars);
      })
  }
});
app.post('/login', (req, res) => {
  const name = req.body.name
  knex('users').select('id').where({ name: name }).returning(['id'])
    .then(function (result) {
      req.session.userID = result[0].id;
      res.render('index')
    })
    .catch(function (error) {
      let templateVars = {
        errCode: 401,
        errMsg: 'name not found'
      }
      res.status(401);
      res.render('error', templateVars);
    })
});
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});
app.post('/index', (req, res) => {
  const id = req.session.userID;
  knex('users').select('name').where({ id: id }).returning('id')
    .then(function (result) {
      const url = req.body.url;
      const title = req.body.title;
      const description = req.body.description;
      const topic = req.body.topic;

      knex('resources').insert({ url: url, title: title, description: description, topic_id: topic, owner_id: result[0].id })
        .then(function () {

        });
    })
});
app.post('/index/:resourceID/like', (req, res) => {
  if (req.session.userID) {
    knex('reactions').where({ 'resource_id': req.params.resourceID }).update({ 'liked': true })
      .then(function (result) {
        res.redirect('/');
      })
  }
  else {
    let templateVars = {
      errCode: 401,
      errMsg: 'Login first'
    }
    res.status(401);
    res.render('error', templateVars);
  }
});
app.post('/index/:resourceID/rate', (req, res) => {
  if (req.session.userID) {
    knex('reactions').where({ 'resource_id': req.params.resourceID }).update({ 'rating': req.body.rating })
      .then(function (result) {
        res.redirect('/');
      })
  }
  else {
    let templateVars = {
      errCode: 401,
      errMsg: 'Login first'
    }
    res.status(401);
    res.render('error', templateVars);
  }
});
app.post('/index/:resourceID/comment', (req, res) => {
  if (req.session.userID) {
    knex('comments').where({ 'resource_id': req.params.resourceID }).update({ 'text': req.body.comment })
      .then(function (result) {
        res.redirect('/');
      })
  }
  else {
    let templateVars = {
      errCode: 401,
      errMsg: 'Login first'
    }
    res.status(401);
    res.render('error', templateVars);
  }
});


app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
