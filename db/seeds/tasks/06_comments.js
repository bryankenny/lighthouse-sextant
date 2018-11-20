
module.exports = function(knex, Promise) {
  return Promise.all([
    knex("comments").insert([
      {user_id: 1, resource_id: 1,  text: "This is a comment"},
      {user_id: 2, resource_id: 2,  text: "Hi there, I'm a comment"},
      {user_id: 3, resource_id: 3,  text: "Comment!"},
      {user_id: 1, resource_id: 4,  text: "This link is dead for me"},
      {user_id: 2, resource_id: 5,  text: "Linked site has a beautiful layout 10/10 would read again"},
      {user_id: 3, resource_id: 6,  text: "Site is outdated and misleading"},
      {user_id: 1, resource_id: 7,  text: "I couldn't stand the writing style"},
      {user_id: 2, resource_id: 8,  text: "This was exactly what I needed"},
      {user_id: 3, resource_id: 9,  text: "WHY WOULD ANYONE POST SUCH A USELESS SITE?"},
      {user_id: 1, resource_id: 10, text: "Nice content but that color scheme made me go blind"},
      {user_id: 2, resource_id: 11, text: "Has the author ever actually used this in the real world?"},
      {user_id: 3, resource_id: 12, text: "Really handy, thank you"},
      {user_id: 1, resource_id: 13, text: "It looks like this content only applies to newer versions"},
      {user_id: 2, resource_id: 14, text: "Does this site look broken to anyone else (I'm using IE 8 fwiw)"},
      {user_id: 3, resource_id: 15, text: "This is way more useful than the reading we were given. Cheers!"},
      {user_id: 1, resource_id: 16, text: "Can anyone explain how to make this work on Windows?"},
      {user_id: 2, resource_id: 17, text: "Why go to all that trouble when you could just use jQuery?"},
      {user_id: 3, resource_id: 18, text: "Cool link. How would I do this in Erlang?"}
    ])
  ]);
};
