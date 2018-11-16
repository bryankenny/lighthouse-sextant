module.exports = function(knex, Promise) {
  return Promise.all([
    knex('resources_topics').insert({resource_id: 1,  topic_id: 17}),
    knex('resources_topics').insert({resource_id: 1,  topic_id: 9}),
    knex('resources_topics').insert({resource_id: 1,  topic_id: 14}),
    knex('resources_topics').insert({resource_id: 2,  topic_id: 14}),
    knex('resources_topics').insert({resource_id: 3,  topic_id: 6}),
    knex('resources_topics').insert({resource_id: 4,  topic_id: 5}),
    knex('resources_topics').insert({resource_id: 5,  topic_id: 5}),
    knex('resources_topics').insert({resource_id: 5,  topic_id: 8}),
    knex('resources_topics').insert({resource_id: 6,  topic_id: 1}),
    knex('resources_topics').insert({resource_id: 7,  topic_id: 9}),
    knex('resources_topics').insert({resource_id: 7,  topic_id: 11}),
    knex('resources_topics').insert({resource_id: 8,  topic_id: 9}),
    knex('resources_topics').insert({resource_id: 8,  topic_id: 10}),
    knex('resources_topics').insert({resource_id: 9,  topic_id: 2}),
    knex('resources_topics').insert({resource_id: 9,  topic_id: 3}),
    knex('resources_topics').insert({resource_id: 10, topic_id: 1}),
    knex('resources_topics').insert({resource_id: 11, topic_id: 6}),
    knex('resources_topics').insert({resource_id: 12, topic_id: 6}),
    knex('resources_topics').insert({resource_id: 13, topic_id: 3}),
    knex('resources_topics').insert({resource_id: 14, topic_id: 7}),
    knex('resources_topics').insert({resource_id: 15, topic_id: 13}),
    knex('resources_topics').insert({resource_id: 15, topic_id: 12}),
    knex('resources_topics').insert({resource_id: 16, topic_id: 3}),
    knex('resources_topics').insert({resource_id: 17, topic_id: 7}),
    knex('resources_topics').insert({resource_id: 17, topic_id: 17}),
    knex('resources_topics').insert({resource_id: 18, topic_id: 1}),
    knex('resources_topics').insert({resource_id: 19, topic_id: 4}),
    knex('resources_topics').insert({resource_id: 19, topic_id: 5}),
    knex('resources_topics').insert({resource_id: 20, topic_id: 4}),
    knex('resources_topics').insert({resource_id: 21, topic_id: 2}),
    knex('resources_topics').insert({resource_id: 22, topic_id: 18}),
    knex('resources_topics').insert({resource_id: 23, topic_id: 18}),
    knex('resources_topics').insert({resource_id: 24, topic_id: 8}),
    knex('resources_topics').insert({resource_id: 25, topic_id: 8})
  ]);
};
