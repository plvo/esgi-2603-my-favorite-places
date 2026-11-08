import { DataSource } from "typeorm";

const datasource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "supersecret",
  database: process.env.DB_NAME || "postgres",
  entities: [__dirname + "/entities/**/*.{js,ts}"],
  logging: true,
  synchronize: true,
});

export default datasource;
