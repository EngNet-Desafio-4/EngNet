PROJECT_NAME = engnet
COMPOSE_FILE = docker-compose.yml

build:
	docker compose -f $(COMPOSE_FILE) build
	docker compose -f $(COMPOSE_FILE) up

up:
	docker compose -f $(COMPOSE_FILE) down
	docker compose -f $(COMPOSE_FILE) up

down:
	docker compose -f $(COMPOSE_FILE) down

clean:
	docker compose -f $(COMPOSE_FILE) down -v --rmi all --remove-orphans

db:
	docker exec -it engnet_postgres psql -U postgres -d engnet -c "SELECT * FROM event_log;"

ssl:
	mkdir -p nginx/certs && cd nginx/certs && openssl genrsa -out server.key 2048 && openssl req -new -x509 -key server.key -out server.crt -days 365 -subj "/C=BR/ST=DF/L=Brasilia/O=MKJS/OU=Dev/CN=localhost"