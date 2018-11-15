
exports.seed = function(knex, Promise) {
  return Promise.all([
    knex("topics").insert({name: "Javascript"}),
    knex("topics").insert({name: "HTML"}),
    knex("topics").insert({name: "CSS"}),
    knex("topics").insert({name: "Git"}),
    knex("topics").insert({name: "Terminal"}),
    knex("topics").insert({name: "Editors"}),
    knex("topics").insert({name: "Node/NPM"}),
    knex("topics").insert({name: "HTTP/REST"}),
    knex("topics").insert({name: "Express"}),
    knex("topics").insert({name: "EJS"}),
    knex("topics").insert({name: "MongoDB"}),
    knex("topics").insert({name: "SQL"}),
    knex("topics").insert({name: "Postgres"}),
    knex("topics").insert({name: "Knex"}),
    knex("topics").insert({name: "jQuery"}),
    knex("topics").insert({name: "Databases"}),
    knex("topics").insert({name: "Heroku"}),
    knex("topics").insert({name: "General"})
  ]);
};
