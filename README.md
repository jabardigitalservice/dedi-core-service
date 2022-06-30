<a href="https://codeclimate.com/github/jabardigitalservice/dedi-core-service/maintainability"><img src="https://api.codeclimate.com/v1/badges/cf5648a807905bcc3467/maintainability" /></a>
<a href="https://codeclimate.com/github/jabardigitalservice/dedi-core-service/test_coverage"><img src="https://api.codeclimate.com/v1/badges/cf5648a807905bcc3467/test_coverage" /></a>
<br>
[![GitHub issues](https://img.shields.io/github/issues/jabardigitalservice/dedi-core-service)](https://github.com/jabardigitalservice/dedi-core-service/issues)
[![GitHub forks](https://img.shields.io/github/forks/jabardigitalservice/dedi-core-service)](https://github.com/jabardigitalservice/dedi-core-service/network)
[![GitHub stars](https://img.shields.io/github/stars/jabardigitalservice/dedi-core-service)](https://github.com/jabardigitalservice/dedi-core-service/stargazers)
[![GitHub license](https://img.shields.io/github/license/jabardigitalservice/dedi-core-service)](https://github.com/jabardigitalservice/dedi-core-service/blob/main/LICENSE)


# Desa Digital App

An integrated one-stop platform for collaborating with startups, SMEs, and other external partners in order to maximize 5,312 villages in West Java to outreach their highest potential.


## Tech Stacks

- **TypeScript** - <https://www.typescriptlang.org/>
- **Node.js** - <http://nodejs.org/>
- **Express Js** - <https://expressjs.com/>
- **Knex Js** - <https://knexjs.org/>
- **MySQL** - <https://www.mysql.com/>
- **Redis** - <https://redis.io/>


## Quick Start

Clone the project:

```bash
$ git clone https://github.com/jabardigitalservice/dedi-core-service
$ cd dedi-core-service
$ cp .env.example .env
```


## Installing Dependencies

- With npm

  ```bash
  # Install node packages
  $ npm install
  ```

- With make

  ```bash
  # Install node packages
  $ make install
  ```


## Applying Migrations

Make sure there is already a MySQL database created and the credetials are filled in the `.env` file

- Locally
  - With npm

    ```bash
    # apply migrations to database
    $ npm run migrate

    # rollback migrations from database
    $ npm run rollback
    ```

  - With make

    ```bash
    # apply migrations to database
    $ make migrate

    # rollback migrations from database
    $ make rollback
    ```

- Locally with docker

  ```bash
  # apply migrations to database
  $ make docker-run-dev-migrate

  # rollback migrations from database
  $ make docker-run-dev-rollback
  ```


## How to Run

- Run locally
  - With npm

    ```bash
    $ npm run dev
    ```

  - with make

    ```bash
    $ make dev
    ```

- Run locally with docker:

  ```bash
  # start
  $ make docker-run-dev

  # stop
  $ make docker-run-dev-stop
  ```

- Run on production with docker:

  ```bash
  # to start
  $ make docker-run

  # to stop
  $ make docker-stop
  ```


## How to Test

Make sure there is already a MySQL test database (should differ with the dev database) created and the credentials are filled in the `.env` file

- Locally

  ```bash
  $ npm run test
  ```

- Locally with docker

  ```bash
  $ make docker-run-dev-test
  ```


## Repo Structure

```
├── .github/          * all workflows github actions
  └── workflows/
├── docker/
├── src/
  └── config/         * config like db, aws, redis, etc.
  └── database/       * migrations, seeds, etc.
  └── handler/        * frequently used exception handling, etc.
  └── helpers/        * helpers and utils
  └── lang/           * messages in id, en, etc.
  └── middleware/     * request's middlewares
  └── modules/        * where all the magics happen
    └── <module_name>
      └── <module_name>_access        * role base access control list
      └── <module_name>_entity        * struct, type, interfaces, etc
      └── <module_name>_handler       * request handler list
      └── <module_name>_http          * routes
      └── <module_name>_log           * logging business
      └── <module_name>_repository    * database queries
      └── <module_name>_rules         * model rules and restrictions
      └── <module_name>_service       * all business logic
      └── <module_name>_test          * remember to keep our code coverage high
└── ...
```


## Code Style Guide

Ref: <https://github.com/airbnb/javascript#airbnb-javascript-style-guide->
