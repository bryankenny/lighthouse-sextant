"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex, query) => {

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

  router.get("/", (req, res) => {
    if (req.session.userID) {
      res.redirect('/index');
    } else {
      res.redirect('/login');
    }
  });
  router.get("/index", (req, res) => {
    res.render('index')
  })
  router.get("/register", (req, res) => {
    if (req.session.userID) {
      res.redirect('/');
    } else {
      res.render('register');
    }
  });
  router.get("/login", (req, res) => {
    if (req.session.userID) {
      res.redirect('/');
    } else {
      res.render('login');
    }
  });
  router.get("/profile", (req, res) => {
    if (req.session.userID) {
      knex('users').select('name').where({ id: req.session.userID })
        .then(function (result) {
          res.render('profile', { result });
        })
    } else {
      res.redirect('/');
    }
  });
  router.get("/myResources", (req, res) => {
    if (req.session.userID) {
      query.getMyResources(req.session.userID).then( (results) => {
        res.render('myResources', results);
      });
    } else {
      res.redirect('/');
    }
  });
  router.get('/searchResults', (req, res) => {
    if (req.session.userID) {
      if (req.query.name) {
        query.getUserResources(req.query.name).then( (results) => {
          // console.log(results);
          res.render('searchResults', {results})
        });
      } else if (req.query.topic) {
        query.getTopicResources(req.query.topic).then( (results) => {
          res.render('searchResults', {results});
        });
      } else {
        res.redirect("/");
      }
    } else {
      res.redirect('/')
    }
  })
  router.get("/index/:day", (req, res) => {
    knex('days').join('days_topics', 'days.id', 'days_topics.day_id')
      .join('topics', 'days_topics.topic_id', 'topics.id')
      .join('resources_topics', 'topics.id', 'resources_topics.topic_id')
      .then(function (result) {
        res.render('day', { result });
      });
  });
  router.get("/index/:resourceID", (req, res) => {
    knex('resources').select().where({ id: req.params.resourceID }).then(function (result) {
      res.render('resource', { result });
    })
  });

  // POSTS -----------------------------------------------------------------------

  router.post('/register', (req, res) => {
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
  router.post('/login', (req, res) => {
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
  router.post('/logout', (req, res) => {
    req.session = null;
    res.redirect('/');
  });
  router.post('/index', (req, res) => {
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
  router.post('/index/:resourceID/like', (req, res) => {
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
  router.post('/index/:resourceID/rate', (req, res) => {
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
  router.post('/index/:resourceID/comment', (req, res) => {
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

  return router;

}
