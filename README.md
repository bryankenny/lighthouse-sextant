# Sextant

This project is intended to serve as a collection of useful links, docs, specs, cheat sheets, etc for students participating in a Lighthouse Labs program.


## Usage

### The Easy Way
[https://sextant-lhl.herokuapp.com/](https://sextant-lhl.herokuapp.com/)

### The Hard Way

- Install PostgreSQL. I won't even try to offer instructions on how to do that.
- In `psql`:
  - `CREATE DATABASE sextant;`
  - `CREATE USER sextant;`
  - `\password sextant`
    - Use the password _sextant_. Really creative, I know.
  - `ALTER USER sextant WITH SUPERUSER`;
- Clone this repository
- `npm install`
- `npm run knex migrate:latest`
- `npm run knex seed:run`

  You may get a database error at this point which we were unable to diagnose in the time available. If so, running the `seed` command a second time seems to consistently do the trick.

- Create a file called `.env` in the project's root directory. Put the following in it:
  ```
  DB_HOST=localhost
  DB_USER=sextant
  DB_PASS=sextant
  DB_NAME=sextant
  ```
- `npm start`
- Direct your browser to [http://localhost:8080](http://localhost:8080)

## Dependencies

- PostgreSQL (not provided when installing the project)
- EJS
- Express
- Knex
- PG
- Moment.js

## Development Dependencies

- Knex Logger
- Morgan
- Nodemon
- Dotenv