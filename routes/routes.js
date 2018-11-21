"use strict";

const express = require('express');
const router = express.Router();

const moment = require("moment");

moment.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "%ds",
    ss: "%ds",
    m: "%dm",
    mm: "%dm",
    h: "%dh",
    hh: "%dh",
    d: "%dd",
    dd: "%dd",
    M: "%dM",
    MM: "%dM",
    y: "%dY",
    yy: "%dY",
  },
})

function compileTemplateVars(req, results) {
  return {results, userID: req.session.userID, userName: req.session.userName, moment: moment};
}

module.exports = (knex, query) => {


  // GETS -------------------------------------------------------------------------


  router.get("/", (req, res) => {

    if (!req.session.userID) res.redirect('/login');

    res.redirect('/index')

  });


  router.get("/index", (req, res) => {

    if (!req.session.userID) res.redirect("/login");

    query.getRecentResources()
      .then( (results) => {
        console.log(JSON.stringify(results, null, 2));
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

  router.get("/my-resources", (req, res) => {

    if (!req.session.userID) res.redirect("/login");
    // console.log("GET my-resources");
    query.getMyResources(req.session.userID).then((results) => {
      res.render('my-resources', compileTemplateVars(req, results));
    });

  });

  router.get("/new-resource", (req, res) => {

    if (!req.session.userID) res.redirect("/login");
    // console.log("GET my-resources");

    res.render("new-resource", compileTemplateVars(req));

  });




  router.get("/resource/:resourceID", (req, res) => {

    let queries;

    query.getResource(req.params.resourceID).then((results) => {
      queries = results;
      (
        (req.session.userID)
        ? query.getReaction(req.session.userID, req.params.resourceID)
        : Promise.resolve()
      ).then((results) => {
          queries.userReaction = results[0];

          query.getReactions(req.params.resourceID).then((results) => {

            queries.likes = results.reduce( (acc, cur) => (cur.liked) ? acc + 1 : acc, 0)
            if (results.length > 0) {
              queries.rating = results.reduce( (acc, cur) => (cur.rating) ? acc + cur.rating : acc, 0) / results.length;
              queries.rating = Math.floor(queries.rating * 2) / 2;
            } else {
              queries.rating = 0;
            }
            queries.numUsers = results.length;

            // console.log(JSON.stringify(queries, null, 2));
            res.render('resource', compileTemplateVars(req, queries ))

          });

        });
    })

  });


  router.get("/topic/:topicID", (req, res) => {

    const queries = {};

    query.getTopicResources(req.params.topicID)
      .then( (results) => {

        queries.resources = results;

        query.getTopicName(req.params.topicID)
          .then( (topic) => {

            queries.topic = topic[0];
            res.render('topic', compileTemplateVars(req, queries));

          });

      })

  });

  router.get("/user/:userID", (req, res) => {

    const queries = {};

    query.getUserResources(req.params.userID)
      .then( (results) => {

        queries.resources = results;

        query.getUserName(req.params.userID)
          .then( (user) => {

            queries.user = user[0].name;
            res.render('user', compileTemplateVars(req, queries));

          });

      })

  });

  router.get("/day/:dayID", (req, res) => {

    const queries = {day: req.params.dayID};

    query.getDayResources(req.params.dayID)
      .then((results) => {

        queries.resources = results;
        res.render('day', compileTemplateVars(req, queries));

    })
  });

  router.get("/*", (req, res) => {

    const err = {
      code: 404,
      msg: "Couldn't find the requested document"
    }
    res.status(err.code);

    console.log(JSON.stringify(compileTemplateVars(req, err)));
    res.render("error", compileTemplateVars(req, err));

  });



  // POSTS -----------------------------------------------------------------------

  router.post('/register', (req, res) => {
    const name = req.body.name

    if (!name) {
      const err = {
        code: 400,
        msg: 'missing name'
      }
      res.status(err.code);
      res.render('error', compileTemplateVars(req, err));
    } else {

      query.registerUser(req.body.name)
        .then((results) => {
          req.session.userID = results[0].id;
          req.session.userName = results[0].name;
          res.redirect('/')
        })
        .catch(function (error) {
          let err = {
            code: 401,
            msg: 'name already exists'
          }
          res.status(401);
          res.render('error', compileTemplateVars(req, err));
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
        let err = {
          code: 401,
          msg: 'name not found'
        }
        res.status(401);
        res.render('error', compileTemplateVars(req, err));
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

  router.post('/new-resource', (req, res) => {
    const userID = req.session.userID;
    const body = req.body;

    const resourceBody = {
      url: body.url,
      title: body.title,
      description: body.description,
      topic: Number(body.topic),
      user_id: userID,
    }

    query.addResource(resourceBody).then((results) => {
      res.redirect('my-resources');
    }).catch((error) => {
      res.status(500).json({error: error.message});
    })
  });


  router.post('/resource/:resourceID/like', (req, res) => {

    if (!req.session.userID) res.redirect("/login");

    const user_id = req.session.userID;
    const resource_id = req.params.resourceID;

    query.toggleLike(user_id, resource_id).then(function (results) {
      res.redirect('/resource/' + req.params.resourceID);
    })

  });


  router.post('/resource/:resourceID/rate', (req, res) => {

    if (!req.session.userID) res.redirect("/login");

    const user_id = req.session.userID;
    const resource_id = req.params.resourceID;
    const rating = req.body.rating;

    query.rate(user_id, resource_id, rating)
      .then(function (results) {
        res.redirect('/resource/' + req.params.resourceID);
      })

  });


  router.post('/resource/:resourceID/comment', (req, res) => {

    if (!req.session.userID) res.redirect("/login");

    const user_id = req.session.userID;
    const resource_id = req.params.resourceID;
    const comment = req.body.text;
    query.comment(user_id, resource_id, comment)
      .then(function (results) {
        res.redirect('/resource/' + resource_id);
      })

  });

  router.post("/*", (req, res) => {

    const err = {
      code: 404,
      msg: "Couldn't find the requested document"
    }
    res.status(err.code);

    res.render("error", compileTemplateVars(req, err));

  });

  return router;

}
