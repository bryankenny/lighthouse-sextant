module.exports = (knex) => {

  const queries = {};

  queries.getProfile = function (id) {

    return knex('users')
      .where({ id: id })
      .select('name')
      .then((result) => result);

  }

  queries.getMyResources = function (userID) {

    let results = {};
    return Promise.all([
      knex('resources')
        .where({ user_id: userID })
        .select("*")
        .then(function (mine) {
          results.mine = mine;
        }),
      knex('resources')
        .join('reactions', 'resources.id', 'reactions.resource_id')
        .select('*')
        .then(function (liked) {
          results.liked = liked;
        })
    ]).then(() => results);

  }

  queries.getUserResources = function (userName) {

    return knex('resources')
      .join("users", "resources.user_id", "users.id")
      .where({ "users.name": userName })
      .select("*")
      .then((results) => results);

  };

  queries.getTopicResources = function (topicName) {

    return knex('resources')
      .join("resources_topics", "resources.id", "resources_topics.resource_id")
      .join("topics", "resources_topics.topic_id", "topics.id")
      .where({ "topics.name": topicName })
      .select("*")
      .then((results) => results);

  };

  queries.getRecentResources = function () {

    return knex("resources")
      .select("*")
      .orderBy("id", "desc")
      .limit(5)
      .then((results) => results);

  };

  queries.getDay = function (day) {

    return knex('days')
      .join('days_topics', 'days.id', 'days_topics.day_id')
      .join('topics', 'days_topics.topic_id', 'topics.id')
      .join('resources_topics', 'topics.id', 'resources_topics.topic_id')
      .where({ 'days.day': day })
      .select("*")
      .orderBy("topics.name")
      .then((result) => result);

  }

  queries.getResource = function (resourceID) {

    return knex('resources')
      .where({ 'resources.id': resourceID })
      .select("*")
      .then((result) => result);

  }

  queries.registerUser = function (name) {

    return knex('users')
      .insert({ name: name })
      .returning(['id'])
      .then((result) => result);

  }

  queries.login = function (name) {

    return knex('users')
      .where({ 'users.name': name })
      .select('id')
      .then((result) => result);

  }

  queries.newResource = function (id, body) {

    const url = body.url;
    const title = body.title;
    const description = body.description;
    const topic = body.topic;

    knex('resources')
      .insert({ url: url, title: title, description: description, topic_id: topic, owner_id: id })
      .returning("id")
      .then((result) => result);


  };

  queries.like = function (user_id, resource_id) {

    knex('reactions')
      .where({ 'resource_id': id })
      .update({ 'user_id': user_id, 'resource_id': resource_id, 'liked': true })

  }

  queries.rate = function (user_id, resource_id, rating) {

    knex('reactions')
      .where({ 'resource_id': id })
      .update({ 'user_id': user_id, 'resource_id': resource_id, 'rating': rating })
  }

  queries.comment = function (user_id, resource_id, comment) {

    knex('comments')
      .where({ 'resource_id': id })
      .insert({ 'user_id': user_id, 'resource_id': resource_id, 'text': comment })

  }


  return queries;
};
