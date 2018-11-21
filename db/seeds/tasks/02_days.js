
module.exports = function(knex, Promise) {
  return Promise.all([
    knex("days").insert([
      {day: "w01d1"},
      {day: "w01d2"},
      {day: "w01d3"},
      {day: "w01d4"},
      {day: "w01d5"},
      {day: "w02d1"},
      {day: "w02d2"},
      {day: "w02d3"},
      {day: "w02d4"},
      {day: "w02d5"},
      {day: "w03d1"},
      {day: "w03d2"},
      {day: "w03d3"},
      {day: "w03d4"},
      {day: "w03d5"},
      {day: "w04d1"},
      {day: "w04d2"},
      {day: "w04d3"},
      {day: "w04d4"},
      {day: "w04d5"},
      {day: "w01we"},
      {day: "w02we"},
      {day: "w03we"},
      {day: "w04we"}
    ])
  ]);
};
