
exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('reactions').insert({user_id: 1, resource_id: 1, liked: true, rating: 3}),
    knex('reactions').insert({user_id: 2, resource_id: 2, liked: false, rating: 1}),
    knex('reactions').insert({user_id: 3, resource_id: 3, liked: true, rating: 4}),
    knex('reactions').insert({user_id: 1, resource_id: 4, liked: false, rating: 1}),
    knex('reactions').insert({user_id: 2, resource_id: 5, liked: true, rating: 3}),
    knex('reactions').insert({user_id: 3, resource_id: 6, liked: false, rating: 2}),
    knex('reactions').insert({user_id: 1, resource_id: 7, liked: true, rating: 4}),
    knex('reactions').insert({user_id: 2, resource_id: 8, liked: false, rating: 1}),
    knex('reactions').insert({user_id: 3, resource_id: 9, liked: true, rating: 5}),
    knex('reactions').insert({user_id: 1, resource_id: 10, liked: false, rating: 1}),
    knex('reactions').insert({user_id: 2, resource_id: 11, liked: true, rating: 4}),
    knex('reactions').insert({user_id: 3, resource_id: 12, liked: false, rating: 4}),
    knex('reactions').insert({user_id: 1, resource_id: 13, liked: true, rating: 4}),
    knex('reactions').insert({user_id: 2, resource_id: 14, liked: false, rating: 3}),
    knex('reactions').insert({user_id: 3, resource_id: 15, liked: true, rating: 3})
  ]);
};
