# AutoPrint

## Features

- [x] Monitor printer status and job status
- [x] Persist new jobs once submitted on printers
- [x] Synchronize status changes of persisted jobs
- [x] Edit printers
- [ ] Submit printing job
    - [ ] Auth (Clerk)
    - [ ] GCode file storage (`100KB` <= files size <= `20MB`)
- [ ] Simple job scheduler for automatically job execution
    - [ ] Use round-robin to select printers
    - [ ] Use FIFO to select jobs
- [ ] Support OctoPrint API
    - [ ] Migrate logic from legacy code

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

Feel free to change the [volume](https://docs.docker.com/reference/cli/docker/container/run/#volume) using other
locations on your host.

### Create Tables

Create a `.env` file under the project root and add your database url

```text
DATABASE_URL=postgres://admin:admin@localhost:5432/printing
```

Run the following commands to create tables:

```shell
bun run db:push
```

### Run Server

```shell
bun run server:dev
```

The server will start and listen to port `3000`.
Now try to call the server's health API.

```shell
curl localhost:3000/health
```

You should get the following response from the printer if everything is OK.

```json
{
  "status": "up"
}
```

Note: you can change the server port by adding `PORT` to the `.env` file.
For example, the `.env` file below configs server to listen port `8000`.

```text
DATABASE_URL=postgres://admin:admin@localhost:5432/printing

PORT=8000
```

### Run Frontend

Create another `.env` file under `website/` to provide URL of the backend server.

```text
VITE_API_BASE_URL='http://127.0.0.1:3000'
```

Now start the frontend by running the command below:

```shell
bun run website:dev
```

The website should be available at `http://localhost:5173`.
