
exports.up = function(knex, Promise) {
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
      t.foreign("day_id").references("days.id");
      t.foreign("topic_id").references("topics.id");
      t.unique(["day", "topic"]);
    })
    .createTable("resources", (t) => {
      t.increments("id");
      t.string("title").notNullable();
      t.string("url").unique().notNullable();
      t.string("description").notNullable();
      t.timestamp("created_at").defaultTo(knex.fn.now());
      t.foreign("user_id").references("users.id");
      t.foreign("topic_id").references("topics.id");
    })
    .createTable("comments", (t) => {
      t.increments("id");
      t.string("text");
      t.timestamp("created_at").defaultTo(knex.fn.now());
      t.foreign("user_id").references("users.id");
      t.foreign("resource_id").references("resources.id");

    })
    .createTable("reactions", (t) => {
      t.increments("id");
      t.boolean("liked");
      t.integer("rating");
      t.foreign("user_id").references("users.id");
      t.foreign("resource_id").references("resources.id");
      t.unique(["user_id", "resource_id"]);
    });
};

exports.down = function(knex, Promise) {
  knex.schema
    .dropTable("topics")
    .dropTable("days")
    .dropTable("days_topics")
    .dropTable("resources")
    .dropTable("comments")
    .dropTable("reactions");
};
