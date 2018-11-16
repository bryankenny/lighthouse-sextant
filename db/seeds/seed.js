exports.seed = function(knex, Promise) {

  const tasks = [
    require("./tasks/00_clear"),
    require("./tasks/01_users"),
    require("./tasks/02_days"),
    require("./tasks/03_topics"),
    require("./tasks/04_days_topics"),
    require("./tasks/05_resources"),
    require("./tasks/06_comments"),
    require("./tasks/07_reactions"),
    require("./tasks/08_resources_topics")
  ];

  // https://css-tricks.com/why-using-reduce-to-sequentially-resolve-promises-works/
  // Tables with foreign key constraints didn't like being run out of order
  return tasks.reduce( async (previousPromise, nextTask) => {
    await previousPromise;
    return nextTask(knex, Promise);
  }, Promise.resolve());

}

