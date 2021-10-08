# Aplikasi Desa Digital

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
