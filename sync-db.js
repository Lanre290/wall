require('ts-node').register({ transpileOnly: true });
const { sequelize } = require('./lib/sequelize');

async function sync() {
  console.log("Syncing DB...");
  await sequelize.sync({ alter: true });
  console.log("DB synced successfully.");
}

sync();
