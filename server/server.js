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
const morgan = require('morgan');
const knexLogger = require('knex-logger');

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
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

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
    res.render('register')
  }
});
app.get("/login", (req, res) => {
  if (req.session.userID) {
    res.redirect('/');
  } else {
    res.render('login')
  }
});
app.get("/profile", (req, res) => {
  if (req.session.userID) {
    res.render('profile')
  } else {
    res.redirect('/');
  }
});
app.get("/newResource", (req, res) => {
  if (req.session.userID) {
    res.render('newResource')
  } else {
    res.redirect('/');
  }
});
app.get("/myResources", (req, res) => {
  if (req.session.userID) {
    let templateVars = {}
    knex('resources').select().where({ownerID: userID})
    .then(function(mine){
      templateVars += mine
    })
    knex('resources').join('reactions', 'resources.ownerID', 'reactions.userID')
    .then(function(liked) {
      templateVars =+ liked
    })
    
    res.render('myResources', templateVars)

  } else {
    res.redirect('/');
  }
});
app.get('/searchResults', (req, res) => {
  if (req.session.userID) {
    if (req.body.name) {
      knex('resources').select().where({ owner: req.body.owner }).then(function (result) {
        res.render('/searchResults', result)
      });
    }
    if (req.body.topic) {
      knex('resources').select().where({ topic: req.body.topic }).then(function (result) {
        res.render('/searchResults', result)
      });
    }
  }
  else {
    res.redirect('/')
  }
})
app.get("/index/:day", (req, res) => {
  res.render('index')
});
app.get("/index/:resourceID", (req, res) => {
  res.render('index')
});

// POSTS -----------------------------------------------------------------------

app.post('/register', (req, res) => {
  if (!req.body.name) {
    const templateVars = {
      errCode: 400,
      errMsg: 'missing name'
    }
    res.status(400);
    res.render('error', templateVars);
  }
  else {
    console.log(req.body.name);
    knex('users').insert({ name: req.body.name })

      .then(function () {
        console.log(knex('users'));
        res.render('index')
      })
      .catch(function (error) {
        console.error(error);
        res.render('error')
      })

    knex('users').select('id').where({ name: req.body.name })
      .then(function (result) {
      req.session.userID = result;
      })
    res.redirect('/');
  }
});
app.post('/login', (req, res) => {
  knex('users').select('id').where({ name: req.body.name })
  .then(function (result) {
    req.session.userID = result;
    res.render('index')
  })
  .catch(function (error) {
    console.error(error);
    res.render('error')
  })
});
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});
app.post('/index', (req, res) => {
  knex('users').select('name').where({ id: req.session.userID }).then(function (result) {
    knex('resources').insert({ url: req.body.url, title: req.body.title, description: req.body.description, topic: req.body.topic, owner: result }).then(function () {
      console.log(knex('resources'))
    });
  })
});

app.post('/index/:resourceID', (req, res) => {

});




app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
