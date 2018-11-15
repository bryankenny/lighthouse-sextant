exports.seed = function(knex, Promise) {

  // Tables need to be cleared and have their ID sequences reset
  // knex.del() doesn't reset the sequence, and knex.truncate()
  // falls over because of foreign key constraints if the queries
  // end up running out of order
  return Promise.all([
    knex.raw(`DELETE FROM reactions; ALTER SEQUENCE reactions_id_seq RESTART WITH 1;`),
    knex.raw(`DELETE FROM comments; ALTER SEQUENCE comments_id_seq RESTART WITH 1;`),
    knex.raw(`DELETE FROM resources_topics; ALTER SEQUENCE resources_topics_id_seq RESTART WITH 1;`),
    knex.raw(`DELETE FROM resources; ALTER SEQUENCE resources_id_seq RESTART WITH 1;`),
    knex.raw(`DELETE FROM days_topics; ALTER SEQUENCE days_topics_id_seq RESTART WITH 1;`),
    knex.raw(`DELETE FROM topics; ALTER SEQUENCE topics_id_seq RESTART WITH 1;`),
    knex.raw(`DELETE FROM days; ALTER SEQUENCE days_id_seq RESTART WITH 1;`),
    knex.raw(`DELETE FROM users; ALTER SEQUENCE users_id_seq RESTART WITH 1;`)
  ]);

};
