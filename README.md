# Boilerplate Express Service

<a href="https://codeclimate.com/github/ayocodingit/boilerplate-express-service/maintainability"><img src="https://api.codeclimate.com/v1/badges/555ba3756e07a1833b9a/maintainability" /></a>
<a href="https://codeclimate.com/github/ayocodingit/boilerplate-express-service/test_coverage"><img src="https://api.codeclimate.com/v1/badges/555ba3756e07a1833b9a/test_coverage" /></a>

## Stack
- **Node.js** - [http://nodejs.org/](http://nodejs.org/)
- **Express Js** - [https://expressjs.com/](https://expressjs.com/)
- **Knex Js** - [https://knexjs.org/](https://knexjs.org/)

## Quick Start

Clone project and install dependencies:
```bash
git clone https://github.com/ayocodingit/boilerplate-express-service
cd boilerplate-express-service
(cd ./src && cp .env.example .env)
```

* Run manually
```
install dependencies
$ make install
migrate
$ make latest
```

* Run on locally with docker :

```
start
$ make docker-run-dev
migrate
$ make docker-run-dev-latest
stop
$ make docker-run-dev-stop
```

* Run on production with docker :

```
start
$ make docker-run
stop
$ make docker-stop
```

## Repo Structure
```
├── .github/
  └── workflows/
    └── ...
├── docker/
  └── ...
├── k8s/
  └── ...
├── src/
  └── ...
├── .codeclimate.yml
├── Makefile
├── docker-compose-dev.yml
├── docker-compose.yml
└── ...
```
