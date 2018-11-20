module.exports = function(knex, Promise) {
  return Promise.all([
    knex("users").insert([
      {name: "Adam", about: "White and nerdy"},
      {name: "Bryan", about: "I'm Bryan, I dunno. I'm a cool guy."},
      {name: "Cam", about: "Couldn't be reached for comment"}
    ])
  ]);
};
