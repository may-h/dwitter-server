import { config } from "../config.js";
import SQ from "sequelize";

const { host, user, database, password } = config.db;
export const sequelize = new SQ.Sequelize(database, user, password, {
  host,
  dialect: "mysql",
  logging: false,
});

/*
const pool = mysql.createPool({
  host,
  user,
  database,
  password,
});

export const db = pool.promise();
*/
