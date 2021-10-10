DOCKER_FILE_PATH := ./docker/Dockerfile.dev
DOCKER_APP_NAME := dedi-app
DOCKER_DEV := -f docker-compose-dev.yml
DOCKER_DEV_EXEC := ${DOCKER_DEV} exec ${DOCKER_APP_NAME}
DOCKER_IMAGES := app-dedi-service

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

rollback:
	npm run rollback

docker-run:
	docker-compose up -d

docker-stop:
	docker-compose down

docker-build:
	docker build -t ${DOCKER_IMAGES} .

docker-run-dev-build:
	docker build -f ${DOCKER_FILE_PATH} -t ${DOCKER_IMAGES} .

docker-run-dev:
	docker-compose ${DOCKER_DEV} up -d

docker-run-dev-stop:
	docker-compose ${DOCKER_DEV} down

docker-run-dev-test:
	docker-compose ${DOCKER_DEV_EXEC} npm run test

docker-run-dev-migrate:
	docker-compose ${DOCKER_DEV_EXEC} npm run migrate

docker-run-dev-rollback:
	docker-compose ${DOCKER_DEV_EXEC} npm run rollback


