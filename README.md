## Run project

```
docker compose up -d db && npm run start:dev
```


## Nest aliases

> To quickly create a CRUD controller with built-in validation, you can use the CLI's CRUD generator:
> ```nest g resource [name]```

## Nestia 

```npx nestia setup```

## Local Postgres (for Sequelize)

1. Start Docker Desktop.
2. From the repo root run: `docker compose up -d db`
3. Connect using the default creds already wired in `src/app.module.ts`:
   - host: localhost
   - port: 5433
   - user: postgres
   - password: root
   - database: nest-mock-api
4. Set `JWT_SECRET` and `JWT_EXPIRES_IN` in `.env`.
5. Run migrations: `npm run migration:up`
6. Start API: `npm run start:dev`
7. To stop: `docker compose down` (data is kept in the `db-data` volume).

## JWT auth

1. Create or use existing user (`POST /users`).
2. Login: `POST /auth/login` with `email` and `password`.
3. Use returned token in header:
   - `Authorization: Bearer <accessToken>`
4. `POST /roles` now requires a valid JWT token.
