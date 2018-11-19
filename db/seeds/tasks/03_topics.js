
module.exports = function(knex, Promise) {

  return knex("topics").insert([
      {name: "Javascript"},
      {name: "HTML"},
      {name: "CSS"},
      {name: "Git"},
      {name: "Terminal"},
      {name: "Editors"},
      {name: "Node/NPM"},
      {name: "HTTP/REST"},
      {name: "Express"},
      {name: "EJS"},
      {name: "MongoDB"},
      {name: "SQL"},
      {name: "Postgres"},
      {name: "Knex"},
      {name: "jQuery"},
      {name: "Databases"},
      {name: "Heroku"},
      {name: "General"}
  ]);

};
