import { Pool } from "pg";

const { PG_PORT, PG_USER, PG_HOST, PG_DB, PG_DB_TEST, PG_PASSWORD, ENV } = process.env;

console.log("environment: ", process.env.ENV);

const pgClient = new Pool({
  port: PG_PORT as unknown as number,
  host: PG_HOST,
  user: PG_USER,
  database: ENV === "dev" ? PG_DB : PG_DB_TEST,
  password: PG_PASSWORD,
});

export default pgClient;
