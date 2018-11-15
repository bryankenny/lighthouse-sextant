
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema
      .table("resources", (t) => {
        t.dropColumn("topic_id");
      })
      .createTable("resources_topics", (t) => {
        t.increments("id");
        t.integer("resource_id").references("resources.id").notNullable();
        t.integer("topic_id").references("topics.id").notNullable();
      })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema
      .table("resources", (t) => {
        t.integer("topic_id").references("topics.id").notNullable();
      })
      .dropTable("resources_topics")
  ]);
};
