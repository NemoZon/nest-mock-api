import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { QueryTypes, Sequelize } from 'sequelize';
import * as migration20260302AddUsersRoleId from './migrations/20260302-add-users-role-id';

type Migration = {
  id: string;
  up: (args: {
    sequelize: Sequelize;
    queryInterface: ReturnType<Sequelize['getQueryInterface']>;
    transaction: Awaited<ReturnType<Sequelize['transaction']>>;
  }) => Promise<void>;
  down: (args: {
    sequelize: Sequelize;
    queryInterface: ReturnType<Sequelize['getQueryInterface']>;
    transaction: Awaited<ReturnType<Sequelize['transaction']>>;
  }) => Promise<void>;
};

const MIGRATIONS: Migration[] = [migration20260302AddUsersRoleId];
const MIGRATIONS_TABLE = '_migrations';

function loadEnvFromDotFile(): void {
  const envPath = resolve(process.cwd(), '.env');
  if (!existsSync(envPath)) {
    return;
  }

  const raw = readFileSync(envPath, 'utf8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex <= 0) {
      continue;
    }
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

async function ensureMigrationsTable(sequelize: Sequelize): Promise<void> {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS "${MIGRATIONS_TABLE}" (
      "id" VARCHAR(255) PRIMARY KEY,
      "runOn" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    )
  `);
}

async function appliedMigrationIds(sequelize: Sequelize): Promise<Set<string>> {
  const rows = await sequelize.query<{ id: string }>(
    `SELECT "id" FROM "${MIGRATIONS_TABLE}"`,
    { type: QueryTypes.SELECT },
  );
  return new Set(rows.map((row) => row.id));
}

async function runUp(sequelize: Sequelize): Promise<void> {
  await ensureMigrationsTable(sequelize);
  const applied = await appliedMigrationIds(sequelize);
  const queryInterface = sequelize.getQueryInterface();

  for (const migration of MIGRATIONS) {
    if (applied.has(migration.id)) {
      continue;
    }

    const transaction = await sequelize.transaction();
    try {
      await migration.up({ sequelize, queryInterface, transaction });
      await sequelize.query(
        `INSERT INTO "${MIGRATIONS_TABLE}" ("id") VALUES (:id)`,
        { replacements: { id: migration.id }, transaction },
      );
      await transaction.commit();
      console.log(`Applied migration: ${migration.id}`);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

async function runDown(sequelize: Sequelize): Promise<void> {
  await ensureMigrationsTable(sequelize);
  const applied = await appliedMigrationIds(sequelize);
  const queryInterface = sequelize.getQueryInterface();
  const migrationToRollback = [...MIGRATIONS]
    .reverse()
    .find((migration) => applied.has(migration.id));

  if (!migrationToRollback) {
    console.log('No applied migrations to rollback');
    return;
  }

  const transaction = await sequelize.transaction();
  try {
    await migrationToRollback.down({ sequelize, queryInterface, transaction });
    await sequelize.query(
      `DELETE FROM "${MIGRATIONS_TABLE}" WHERE "id" = :id`,
      {
        replacements: { id: migrationToRollback.id },
        transaction,
      },
    );
    await transaction.commit();
    console.log(`Rolled back migration: ${migrationToRollback.id}`);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function bootstrap(): Promise<void> {
  loadEnvFromDotFile();

  const sequelize = new Sequelize(
    process.env.DB_NAME ?? 'nest-mock-api',
    process.env.DB_USERNAME ?? 'postgres',
    process.env.DB_PASSWORD ?? 'root',
    {
      dialect: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      logging: false,
    },
  );

  try {
    const mode = process.argv[2] ?? 'up';
    if (mode === 'down') {
      await runDown(sequelize);
      return;
    }
    await runUp(sequelize);
  } finally {
    await sequelize.close();
  }
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
