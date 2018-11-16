exports.seed = function(knex, Promise) {

  const tasks = [
    require("./tasks/clear")(knex, Promise),
    require("./tasks/users")(knex, Promise),
    require("./tasks/days")(knex, Promise),
    require("./tasks/topics")(knex, Promise),
    require("./tasks/days_topics")(knex, Promise),
    require("./tasks/resources")(knex, Promise),
    require("./tasks/comments")(knex, Promise),
    require("./tasks/reactions")(knex, Promise),
    require("./tasks/resources_topics")(knex, Promise)
  ]

  return tasks.reduce((promiseChain, currentTask) => {
    return promiseChain.then( chainResults =>
      currentTask.then(currentResult =>
        [ ...chainResults, currentResult ]
      )
    );
  }, Promise.resolve([]));

}
