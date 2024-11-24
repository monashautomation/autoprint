# AutoPrint

## Quickstart

### Install Bun

We use [Bun](https://bun.sh/) as JS runtime and package manager,
please install it before moving on.

### Clone Repo

```shell
git clone https://github.com/monash-automation/autoprint.git
```

### Install Dependencies

```shell
bun install
```

### Setup Database

Go ahead with an existing Postgres database or create a new database container using the command below:

```shell
docker run -d --name autoprint-db -p 5432:5432 \
  -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin \
  -v /var/lib/autoprint/postgresql/data:/var/lib/postgresql/data \
  --restart unless-stopped \
  postgres
```

Feel free to change the [volume](https://docs.docker.com/reference/cli/docker/container/run/#volume) using other locations on your host.

### Create Tables

Create a `.env` file under the project root and add your database url

```text
DATABASE_URL=postgres://admin:admin@localhost:5432/printing
```

Run the following commands to create tables:

```shell
bun run db:push
```