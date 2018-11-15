
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema
      .createTable("topics", (t) => {
        t.increments("id");
        t.string("name").unique().notNullable();
      })
      .createTable("days", (t) => {
        t.increments("id");
        t.string("week").notNullable();
        t.string("day").notNullable();
        t.unique(["week", "day"]);
      })
      .createTable("days_topics", (t) => {
        t.increments("id");
        t.integer("day_id").references("days.id").notNullable();
        t.integer("topic_id").references("topics.id").notNullable();
        t.unique(["day_id", "topic_id"]);
      })
      .createTable("resources", (t) => {
        t.increments("id");
        t.string("title").notNullable();
        t.string("url").unique().notNullable();
        t.string("description").notNullable();
        t.timestamp("created_at").defaultTo(knex.fn.now());
        t.integer("user_id").references("users.id").notNullable();
        t.integer("topic_id").references("topics.id").notNullable();
      })
      .createTable("days_resources", (t) => {
        t.increments("id");
        t.integer("day_id").references("days.id").notNullable();
        t.integer("resource_id").references("resources.id").notNullable();
      })
      .createTable("comments", (t) => {
        t.increments("id");
        t.string("text");
        t.timestamp("created_at").defaultTo(knex.fn.now());
        t.integer("user_id").references("users.id").notNullable();
        t.integer("resource_id").references("resources.id").notNullable();
      })
      .createTable("reactions", (t) => {
        t.increments("id");
        t.boolean("liked");
        t.integer("rating");
        t.integer("user_id").references("users.id").notNullable();
        t.integer("resource_id").references("resources.id").notNullable();
        t.unique(["user_id", "resource_id"]);
      })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema
      .dropTable("comments")
      .dropTable("reactions")
      .dropTable("days_resources")
      .dropTable("resources")
      .dropTable("days_topics")
      .dropTable("topics")
      .dropTable("days")
  ]);
};
