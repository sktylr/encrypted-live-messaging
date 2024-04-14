.PHONY: format build run down restart migrations migrate

format:
	isort api && black api && npm --prefix client run prettier

build:
	docker-compose -f docker-compose.yml build

run:
	docker-compose -f docker-compose.yml up

down:
	docker-compose -f docker-compose.yml down

restart:
	make down && make run

migrations:
	docker-compose -f docker-compose.yml run --rm api python api/manage.py makemigrations

migrate:
	docker-compose -f docker-compose.yml run --rm api python api/manage.py migrate

shell:
	docker-compose -f docker-compose.yml run --rm api python api/manage.py shell

