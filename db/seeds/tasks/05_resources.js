
module.exports = function(knex, Promise) {
  return Promise.all([
    knex("resources").insert({
      url:          "https://medium.com/@HalahSalih/how-to-deploy-an-express-app-to-heroku-with-postgresql-database-using-git-266e100d59ff",
      title:        "Deploying Express apps with a Postgres database to Heroku",
      description:  "How to deploy an Express app to Heroku with Postgresql Using Git",
      user_id:      1
    }),
    knex("resources").insert({
      url:          "https://devhints.io/knex",
      title:        "Knex cheatsheet",
      description:  "A summary of Knex syntax and methods",
      user_id:      2
    }),
    knex("resources").insert({
      url:          "https://devhints.io/vim",
      title:        "Vim cheatsheet",
      description:  "A summary of Vim key commands",
      user_id:      3
    }),
    knex("resources").insert({
      url:          "https://devhints.io/bash",
      title:        "Bash cheatsheet",
      description:  "A summary of Bash commands and syntax",
      user_id:      1
    }),
    knex("resources").insert({
      url:          "https://devhints.io/curl",
      title:        "Curl cheatsheet",
      description:  "A summary of Curl options and syntax",
      user_id:      2
    }),
    knex("resources").insert({
      url:          "http://eloquentjavascript.net/",
      title:        "Eloquent Javascript",
      description:  "A book covering every aspect of Javascript",
      user_id:      3
    }),
    knex("resources").insert({
      url:          "https://zellwk.com/blog/crud-express-mongodb/",
      title:        "Building a Simple CRUD app with Express and MongoDB",
      description:  "Walks through the creation of a simple server + database app",
      user_id:      1
    }),
    knex("resources").insert({
      url:          "https://scotch.io/tutorials/use-ejs-to-template-",
      title:        "Use EJS to Template Your Node Application",
      description:  "Great explanation of how to create a basic web application",
      user_id:      2
    }),
    knex("resources").insert({
      url:          "https://www.youtube.com/watch?v=tSv2KIF7uE4",
      title:        "HTML-CSS-DOM",
      description:  "Short video explaining how the DOM works",
      user_id:      3
    }),
    knex("resources").insert({
      url:          "https://javascript30.com/",
      title:        "Javascript 30",
      description:  "Free course that uses a series of tiny projects to show off some of the things Javascript can do on a web page",
      user_id:      1
    }),
    knex("resources").insert({
      url:          "https://codeburst.io/top-javascript-vscode-exten",
      title:        "Top JavaScript VSCode Extensions",
      description:  "A list of useful VS Code extensions for Javascript developers",
      user_id:      2
    }),
    knex("resources").insert({
      url:          "https://www.sitepoint.com/10-essential-sublime-t",
      title:        "10 Essential Sublime Text Plugins",
      description:  "A list of useful Sublime Text plugins for developers",
      user_id:      3
    }),
    knex("resources").insert({
      url:          "https://hackernoon.com/css-box-model-45ecf4ac219",
      title:        "CSS Box Model for Beginners",
      description:  "Detailed explanation of each piece in the CSS box model",
      user_id:      1
    }),
    knex("resources").insert({
      url:          "https://stackabuse.com/how-to-use-module-exports",
      title:        "How to use module.exports",
      description:  "Examples showing how Node modules work",
      user_id:      2
    }),
    knex("resources").insert({
      url:          "https://pgexercises.com/",
      title:        "PostgreSQL Exercises",
      description:  "Interactive SQL problems, with very detailed solutions",
      user_id:      3
    }),
    knex("resources").insert({
      url:          "https://www.smashingmagazine.com/2007/07/css-spe",
      title:        "CSS Specificity: Things You Should Know",
      description:  "Detailed explanation of how a CSS selector's specificity is calculated",
      user_id:      1
    }),
    knex("resources").insert({
      url:          "https://devcenter.heroku.com/articles/deploying-",
      title:        "Deploying Node.js Apps on Heroku",
      description:  "Heroku's documentation for getting your Node app up and running",
      user_id:      2
    }),
    knex("resources").insert({
      url:          "https://github.com/airbnb/javascript",
      title:        "AirBnB Javascript Style Guide",
      description:  "One of the most popular style guides for keeping your Javascript clean, organized, and maintainable",
      user_id:      3
    }),
    knex("resources").insert({
      url:          "http://maximomussini.com/posts/bash-git-prompt/",
      title:        "Improving your Git Experience in Bash",
      description:  "Terminal scripts and modifications to make working with Git less painful",
      user_id:      1
    }),
    knex("resources").insert({
      url:          "https://marklodato.github.io/visual-git-guide/in",
      title:        "A Visual Git Reference",
      description:  "Great explanation of various Git concepts",
      user_id:      2
    }),
    knex("resources").insert({
      url:          "https://www.smashingmagazine.com/2008/11/12-prin",
      title:        "12 Principles For Clean HTML",
      description:  "Simple rules to keep your HTML files from getting out of control",
      user_id:      3
    }),
    knex("resources").insert({
      url:          "https://devdocs.io/",
      title:        "DevDocs",
      description:  "Compiles the documentation for dozens of popular programs and libraries in one search engine",
      user_id:      1
    }),
    knex("resources").insert({
      url:          "https://developer.mozilla.org/en-US/",
      title:        "MDN Web Docs",
      description:  "Pretty much the official handbook for Javascript, HTML, and CSS, with great documentation on third-party tools like Express and jQuery",
      user_id:      2
    }),
    knex("resources").insert({
      url:          "https://developer.mozilla.org/en-US/docs/Web/HTT",
      title:        "An overview of HTTP",
      description:  "Thorough explanation of the HTTP protocol",
      user_id:      3
    }),
    knex("resources").insert({
      url:          "https://www.codecademy.com/articles/what-is-rest",
      title:        "What is REST?",
      description:  "Thorough explanation of the REST API style",
      user_id:      1
    }),
  ]);
};

