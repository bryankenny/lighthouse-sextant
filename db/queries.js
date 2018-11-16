module.exports = (knex) => {

  const queries = {};

  queries.getProfile = function (id) {
    return knex('users').select('name').where({ id: id })
      .then((result) => result);
  }

  queries.getMyResources = function (userID) {

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
    ]).then(() => templateVars);

  }

  queries.getUserResources = function (userName) {

    console.log("getting resources owned by " + userName);

    return knex('resources')
      .join("users", "resources.user_id", "users.id")
      .select("*")
      .where({ "users.name": userName })
      // .then( (results) => {results: results} );
      .then((results) => results);

  };

  queries.getTopicResources = function (topicName) {

    return knex('resources')
      .join("resources_topics", "resources.id", "resources_topics.resource_id")
      .join("topics", "resources_topics.topic_id", "topics.id")
      .select("*")
      .where({ "topics.name": topicName })
      .then((results) => results);

  };

  queries.getDay = function (day) {

    return knex('days').join('days_topics', 'days.id', 'days_topics.day_id')
      .join('topics', 'days_topics.topic_id', 'topics.id')
      .join('resources_topics', 'topics.id', 'resources_topics.topic_id')
      .where({ 'days.day': day })
      .then((result) => result);
  }

  queries.getResource = function (resourceID) {
    return knex('resources').select()
      .where({ 'resources.id': resourceID })
      .then((result) => result);
  }

  queries.registerUser = function (name) {
    return knex('users').insert({ name: name }).returning(['id'])
      .then((result) => result);
  }

  queries.login = function (name) {
    return knex('users').select('id').where({ 'users.name': name })
      .then((result) => result);
  }

  queries.newResource = function (id, body) {
    knex('users').select('name').where({ id: id }).returning('id')
      .then(function (result) {
        const url = body.url;
        const title = body.title;
        const description = body.description;
        const topic = body.topic;

        knex('resources').insert({ url: url, title: title, description: description, topic_id: topic, owner_id: result[0].id })
          .then((result) => result);
      })
  };

  queries.like = function (user_id, resource_id) {
    knex('reactions').where({ 'resource_id': id })
      .update({ 'user_id': user_id, 'resource_id': resource_id, 'liked': true })
  }

  queries.rate = function (user_id, resource_id, rating) {
    knex('reactions').where({ 'resource_id': id })
      .update({ 'user_id': user_id, 'resource_id': resource_id, 'rating': rating })
  }

  queries.comment = function (user_id, resource_id, comment) {
    knex('comments').where({ 'resource_id': id })
      .update({ 'user_id': user_id, 'resource_id': resource_id, 'text': comment })
  }
  return queries;
};
