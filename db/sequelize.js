import { Sequelize } from "sequelize";
import { config } from "../config.js";
import {} from "../model/tweets.js";

const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    dialect: "mysql",
  }
);

export async function getConnection() {
  try {
    await sequelize.authenticate();
    console.log("Sequelize connection has been established successfully.");
    return sequelize;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
