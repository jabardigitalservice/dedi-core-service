# Aplikasi Desa Digital

<a href="https://codeclimate.com/github/jabardigitalservice/dedi-core-service/maintainability"><img src="https://api.codeclimate.com/v1/badges/cf5648a807905bcc3467/maintainability" /></a>
<a href="https://codeclimate.com/github/jabardigitalservice/dedi-core-service/test_coverage"><img src="https://api.codeclimate.com/v1/badges/cf5648a807905bcc3467/test_coverage" /></a>

## Stack
- **Node.js** - [http://nodejs.org/](http://nodejs.org/)
- **Express Js** - [https://expressjs.com/](https://expressjs.com/)
- **Knex Js** - [https://knexjs.org/](https://knexjs.org/)

## Quick Start

Clone project and install dependencies:
```bash
git clone https://github.com/jabardigitalservice/dedi-core-service
cd dedi-core-service
cp .env.example .env
```

* Run manually
```
install dependencies
$ make install
migrate
$ make migrate
```

* Run on locally with docker:

```
start
$ make docker-run-dev
stop
$ make docker-run-dev-stop
migrate
$ make docker-run-dev-migrate
rollback
$ make docker-run-dev-rollback
test
$ make docker-run-dev-test
```

* Run on production with docker:

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
