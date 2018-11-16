exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('users').insert({name: 'Adam'}),
    knex('users').insert({name: 'Bryan'}),
    knex('users').insert({name: 'Cam'})
  ]);
};
