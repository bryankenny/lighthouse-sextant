
exports.up = function(knex, Promise) {
  return knex.schema
    .table("days", (t) => {
      t.dropColumn("week");
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .table("days", (t) => {
      t.string("week");
      t.unique(["week", "day"]);
    });
};
