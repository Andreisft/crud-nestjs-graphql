import { ConnectionOptions } from "typeorm";

import * as dotenv from "dotenv";
import * as fs from "fs";

try {
  const environment = process.env.NODE_ENV || "development";
  const data = dotenv.parse(fs.readFileSync(`${environment}.env`));

  if (data) {
    for (const k in data) {
      process.env[k] = data[k];
    }
  }
} catch (err) {}

const config: ConnectionOptions = {
  type: "postgres",
  port: 5432,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + "/**/*.entity{.ts,.js}"],
  logging: false,
  migrationsRun: true,
  migrations: [__dirname + "/migrations/*{.ts,.js}"],
  cli: {
    migrationsDir: "/src/migrations",
  },
};

export = config;
