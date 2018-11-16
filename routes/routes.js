"use strict";

const express = require('express');
const router = express.Router();

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
      query.getProfile(req.session.userID)
        .then(function (result) {
          res.render('profile', { result });
        })
    } else {
      res.redirect('/');
    }
  });
  router.get("/myResources", (req, res) => {
    if (req.session.userID) {
      query.getMyResources(req.session.userID).then((results) => {
        res.render('myResources', results);
      });
    } else {
      res.redirect('/');
    }
  });
  router.get('/searchResults', (req, res) => {
    if (req.session.userID) {
      if (req.query.name) {
        query.getUserResources(req.query.name).then((results) => {
          // console.log(results);
          res.render('searchResults', { results })
        });
      } else if (req.query.topic) {
        query.getTopicResources(req.query.topic).then((results) => {
          res.render('searchResults', { results });
        });
      } else {
        res.redirect("/");
      }
    } else {
      res.redirect('/')
    }
  })
  router.get("/index/day/:day", (req, res) => {
    query.getDay(req.params.day).then((result) => {
      res.render('day', { result });
    })
  });
  router.get("/index/resource/:resourceID", (req, res) => {
    query.getResource(req.params.resourceID).then((result) => {
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
      query.registerUser(req.body.name).then((result) => {
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
    query.login(name).then(function (result) {
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
    const body = req.body;
    query.newResource(id, body).then(function () {
      res.redirect('/')
    })
  });
  router.post('/index/resource/:resourceID/like', (req, res) => {
    if (req.session.userID) {
      const user_id = req.session.userID;
      const resource_id = req.params.resourceID;

      query.like(user_id, resource_id).then(function (result) {
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
  router.post('/index/resource/:resourceID/rate', (req, res) => {
    if (req.session.userID) {
      const user_id = req.session.userID;
      const resource_id = req.params.resourceID;
      const rating = req.body.rating;
      query.rate(user_id, resource_id, rating)
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
  router.post('/index/resource/:resourceID/comment', (req, res) => {
    if (req.session.userID) {
      const user_id = req.session.userID;
      const resource_id = req.params.resourceID;
      const comment = req.body.comment;
      query.comment(user_id, resource_id, comment)
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
