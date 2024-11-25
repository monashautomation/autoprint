# Deployment

Currently, the service is deployed on a Linux server in the lab.
The service will keep to be local until the lab is granted to become public. 

## Prerequisites

Install following packages before moving on.

- [Docker](https://docs.docker.com/engine/install/)
- [Bun](https://bun.sh/)
- [Caddy](https://caddyserver.com/docs/install)

TODO: fully containerize to avoid installing Bun and Caddy.

## Log in to Server

```shell
ssh pi@172.32.1.190 # password Monash2024
```

## Clone Repo

```shell
git clone https://github.com/monash-automation/autoprint.git
```

## Install Dependencies

```shell
cd autoprint
bun install
```

## Setup Database

```shell
docker network create autoprint
```

```shell
mkdir -p /var/lib/autoprint/postgresql/data

docker run -d --name autoprint-db -p 5432:5432 \
  -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=printing \
  -v /var/lib/autoprint/postgresql/data:/var/lib/postgresql/data \
  --network=autoprint \
  --restart unless-stopped \
  postgres
```

```shell
cat << EOF > .env
DATABASE_URL=postgres://admin:admin@localhost:5432/printing
PORT=8000
EOF
```

```shell
bun run db:push
```

## Build Backend

```shell
sudo docker build -t autoprint-server .
```

```shell
docker run -d \
  --name autoprint-server \
  -p 8000:8000 \
  -e PORT=8000 \
  -e DATABASE_URL=postgres://admin:admin@autoprint-db:5432/printing \
  --network=autoprint \
  --restart unless-stopped \
  autoprint-server
```

## Build Website

Add `.env` file

```shell
cat << EOF > website/.env
VITE_API_BASE_URL='http://172.32.1.190:8000'
EOF
```

Build frontend website

```shell
bun run website:build && \
sudo mkdir -p /var/lib/autoprint/html/ && \
sudo cp -r website/dist/* /var/lib/autoprint/html/
```

## Setup Reverse Proxy

Update Caddy config

```shell
sudo cat << EOF > /etc/caddy/Caddyfile
:80 {
        handle /api/* {
                reverse_proxy :8000
        }

        handle {
                file_server
                root * /var/lib/autoprint/html
                try_files {path} /index.html
        }
}
EOF
```

Reload Caddy

```shell
sudo caddy reload
```