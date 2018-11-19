
exports.up = function(knex, Promise) {
  return knex.schema
    .table("users", (t) => {
      t.string("about");
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .table("users", (t) => {
      t.dropColumn("about");
    });
};
