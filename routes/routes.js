"use strict";

const express = require('express');
const router = express.Router();

function compileTemplateVars(req, results) {
  return {results, userID: req.session.userID, userName: req.session.userName};
}

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

    if (!req.session.userID) res.redirect('/login');

    res.redirect('/index')

  });


  router.get("/index", (req, res) => {

    if (!req.session.userID) res.redirect("/login");

    query.getRecentResources()
      .then( (results) => {
        res.render('index', compileTemplateVars(req, results));
      })

  });


  router.get("/register", (req, res) => {

    if (req.session.userID) res.redirect("/");

    res.render('register');

  });


  router.get("/login", (req, res) => {

    if (req.session.userID) res.redirect("/");

    res.render('login');

  });


  router.get("/profile", (req, res) => {

    if (!req.session.userID) res.redirect("/login");

    query.getProfile(req.session.userID)
      .then(function (results) {
        res.render('profile', compileTemplateVars(req, results));
      })

  });


  router.get("/my-resources", (req, res) => {

    if (!req.session.userID) res.redirect("/login");
    // console.log("GET my-resources");
    query.getMyResources(req.session.userID).then((results) => {
      const resources = results.mine
      res.render('my-resources', compileTemplateVars(req, resources));
    });

  });


  router.get('/searchResults', (req, res) => {
    if (!req.session.userID) res.redirect("/login");

    if (req.query.name) {
      query.getUserResources(req.query.name).then((results) => {
        // console.log(results);
        res.render('searchResults', compileTemplateVars(req, results));
      });
    } else if (req.query.topic) {
      query.getTopicResources(req.query.topic).then((results) => {
        res.render('searchResults', compileTemplateVars(req, results));
      });
    } else {
      res.redirect("/");
    }

  })


  router.get("/day/:day", (req, res) => {
    query.getDayResources(req.params.day).then((results) => {
      res.render('day', compileTemplateVars(req, results));
    })
  });


  router.get("/resource/:resourceID", (req, res) => {
    query.getResource(req.params.resourceID).then((results) => {
      res.render('resource', compileTemplateVars(req, results));
      console.log(resource_id);
    })
  });


  // POSTS -----------------------------------------------------------------------

  router.post('/register', (req, res) => {
    const name = req.body.name

    if (!name) {
      const templateVars = {
        errCode: 400,
        errMsg: 'missing name'
      }
      res.status(400);
      res.render('error', templateVars);
    } else {

      query.registerUser(req.body.name)
        .then((results) => {
          req.session.userID = results[0].id;
          req.session.userName = results[0].name;
          res.redirect('/')
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

    query.login(name)
      .then(function (results) {
        req.session.userID = results[0].id;
        req.session.userName = results[0].name;
        res.redirect('/')
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
    const userID = req.session.userID;
    const body = req.body;

    query.newResource(userID, body).then(function () {
      res.redirect('/')
    })

  });

  router.post('/my-resources', (req, res) => {
    const userID = req.session.userID;
    const body = req.body;

     const resourceBody = {
      url: body.resource_url,
      title: body.resource_topic,
      description: body.resource_description,
      user_id: userID,
    }
    knex('resources').insert(resourceBody).then((data) => {
      res.redirect('my-resources');
    }).catch((error) => {
      res.status(500).json({error: error.message});
    })
  });



  router.post("/user-resources", (req, res) => {
    const name = req.body.username;
        console.log(name)

    query.getUserResources(name)
    .then(function (results) {
      res.render('user-resources', compileTemplateVars(req, results));
    })
  })


  router.post('/resource/:resourceID/like', (req, res) => {

    if (!req.session.userID) res.redirect("/login");

    const user_id = req.session.userID;
    const resource_id = req.params.resourceID;

    query.like(user_id, resource_id).then(function (results) {
      res.redirect('/');
    })

  });


  router.post('/resource/:resourceID/rate', (req, res) => {

    if (!req.session.userID) res.redirect("/login");

    const user_id = req.session.userID;
    const resource_id = req.params.resourceID;
    const rating = req.body.rating;

    query.rate(user_id, resource_id, rating)
      .then(function (results) {
        res.redirect('/');
      })

  });


  router.post('/resource/:resourceID/comment', (req, res) => {

    if (!req.session.userID) res.redirect("/login");

    const user_id = req.session.userID;
    const resource_id = req.params.resourceID;
    const comment = req.body.comment;
    query.comment(user_id, resource_id, comment)
      .then(function (results) {
        res.redirect('/');
      })

  });


  return router;

}
