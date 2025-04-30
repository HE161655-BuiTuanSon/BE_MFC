import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  database: "mfc",
  username: "root",
  password: "123456",
  host: "localhost",
  dialect: "mysql",
  logging: false,
});
