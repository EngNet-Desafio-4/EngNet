# engnet-api

Documentação rápida para *buildar*, executar e desenvolver localmente a API **engnet-api** (NestJS + TypeORM + PostgreSQL) usando Docker.

---

## Pré-requisitos

* Docker e Docker Compose instalados
* GNU Make (opcional, mas recomendado)
* Node.js (só necessário para desenvolvimento local, não obrigatório se usar Docker)

---

## Arquivos importantes

* `Dockerfile` — imagem do backend (Node 20-alpine, com nodemon para hot-reload)
* `docker-compose.yml` — orquestra `postgres` e `backend`, define volumes, rede e healthcheck
* `.env` — variáveis de ambiente (DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME)
* `Makefile` — atalhos para `docker compose build/up/down` e comandos úteis

---

## `.env` exemplo (colocar na raiz do projeto)

```env
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=engnet
```

**Observação:** dentro do ambiente Docker o `DB_HOST` deve ser o **nome do serviço** `postgres` (não `localhost`).

---

## Makefile — explicação dos alvos


* `make build`

    * **O que faz:** Executa `docker compose build` para construir as imagens definidas no `docker-compose.yml` (inclui o `backend`).
    * **Quando usar:** quando você alterou o `Dockerfile`, dependências (package.json) ou quer reconstruir imagens do zero.
    * **Saída esperada:** processo de build do Docker; cache pode acelerar builds subsequentes.

* `make up`

    * **O que faz:** Executa `docker compose up -d`, sobe os containers em background (detached).
    * **Quando usar:** para rodar a aplicação em modo de produção/desenvolvimento sem bloquear seu terminal.
    * **Atenção:** usa os volumes e `env_file` configurados no `docker-compose.yml`.

* `make down`

    * **O que faz:** Executa `docker compose down` e para os containers do projeto.
    * **Quando usar:** parar a aplicação e liberar as portas.
    * **Nota:** não remove volumes nem imagens por padrão.

* `make clean`

    * **O que faz:** Para os containers e remove volumes, imagens e containers órfãos (`down -v --rmi all --remove-orphans`).
    * **Quando usar:** quando quiser limpar tudo e começar do zero. **Cuidado:** remove dados persistidos no volume do Postgres se for um volume gerenciado pelo Compose.
---

## Como rodar com Docker (passo-a-passo)

1. Verifique `.env` configurado (veja o exemplo acima).
2. Construir imagens (opcional):

```bash
make build
```

3. Subir containers:

```bash
make up
```

4. Parar a aplicação:

```bash
make down
```

5. Limpar tudo (volumes + imagens):

```bash
make clean
```