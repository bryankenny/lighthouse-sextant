module.exports = (knex) => {

  const queries = {};

  queries.getMyResources = function(userID) {

    console.log("querying resources and likes for user_id " + userID);
    let templateVars = {};
    return Promise.all([
      knex('resources')
        .select("*")
        .where({ user_id: userID })
        .then(function (mine) {
          templateVars.mine = mine;
        }),
      knex('resources')
        .join('reactions', 'resources.id', 'reactions.resource_id')
        .select('*')
        .then(function (liked) {
          templateVars.liked = liked;
        })
    ]).then( () => templateVars );

  }

  queries.getUserResources = function(userName) {

    console.log("getting resources owned by " + userName);

    return knex('resources')
      .join("users", "resources.user_id", "users.id")
      .select("*")
      .where({ "users.name": userName })
      // .then( (results) => {results: results} );
      .then( (results) => results );

  };

  queries.getTopicResources = function(topicName) {

    return knex('resources')
      .join("resources_topics", "resources.id", "resources_topics.resource_id")
      .join("topics", "resources_topics.topic_id", "topics.id")
      .select("*")
      .where({ "topics.name": topicName })
      .then( (results) => results );

  };

  queries.getDay = function(day) {

    return knex('days').join('days_topics', 'days.id', 'days_topics.day_id')
    .join('topics', 'days_topics.topic_id', 'topics.id')
    .join('resources_topics', 'topics.id', 'resources_topics.topic_id')
    .where({'days.day': day})
    .then( (result) => result );
  }

  queries.getResource = function(resourceID) {
    knex('resources').select()
    .where({ 'resources.id': resourceID })
    .then( (result) => result);
  }


  return queries;
};
