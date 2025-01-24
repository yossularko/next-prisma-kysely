import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";

// to be modified according to your folder/file structure
import { DB } from "../../prisma/generated/types";

// to be modified according to your folder/file structure
export * from "../../prisma/generated/types";

const dialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    port: Number(process.env.DATABASE_PORT),
    password: process.env.DATABASE_PASSWORD,
    max: 10,
  }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<DB>({
  dialect,
});
