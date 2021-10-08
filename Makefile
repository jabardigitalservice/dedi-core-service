include .env

DOCKER_FILE_PATH := ./docker/Dockerfile.dev
DOCKER_APP_NAME := express-app
DOCKER_DEV := -f docker-compose-dev.yml
DOCKER_DEV_EXEC := ${DOCKER_DEV} exec ${DOCKER_APP_NAME}

install:
	npm install

dev:
	npm run dev

start:
	npm run start

build:
	npm run build

lint:
	npm run lint

migrate:
	npm run migrate

refresh:
	npm run refresh

up:
	npm run up

down:
	npm run down

docker-run:
	docker-compose up -d

docker-stop:
	docker-compose down

docker-build:
	docker build -t boilerplate-express-service .

docker-run-dev-build:
	docker build -f ${DOCKER_FILE_PATH} -t boilerplate-express-service .

docker-run-dev:
	docker-compose ${DOCKER_DEV} up -d

docker-run-dev-stop:
	docker-compose ${DOCKER_DEV} down

docker-run-dev-test:
	docker-compose ${DOCKER_DEV_EXEC} npm run test

docker-run-dev-migrate:
	docker-compose ${DOCKER_DEV_EXEC} npm run migrate

docker-run-dev-refresh:
	docker-compose ${DOCKER_DEV_EXEC} npm run refresh

docker-run-dev-migrate-up:
	docker-compose ${DOCKER_DEV_EXEC} npm run up

docker-run-dev-migrate-down:
	docker-compose ${DOCKER_DEV_EXEC} npm run down

