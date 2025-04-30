import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";
import process from "process";
import { fileURLToPath } from "url";

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const configJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../config/config.json"), "utf8")
);
const config = configJson[env];

export const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const files = fs
  .readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
  );

for (const file of files) {
  try {
    const modelPath = path.join(__dirname, file);
    const modelUrl = new URL(`file://${modelPath}`);
    const model = (await import(modelUrl)).default(
      sequelize,
      Sequelize.DataTypes
    );

    if (model) {
      db[model.name] = model;
    }
  } catch (error) {
    console.error(`Error loading model from file: ${file}`, error);
  }
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
