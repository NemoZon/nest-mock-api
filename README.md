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
   - port: 5432
   - user: postgres
   - password: root
   - database: nest-mock-api
4. To stop: `docker compose down` (data is kept in the `db-data` volume).
