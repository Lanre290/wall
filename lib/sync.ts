import { sequelize } from './sequelize';

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');
    
    // Sync all models (creates tables if they don't exist, alters them if they do)
    await sequelize.sync({ alter: true });
    console.log('✅ All models were synchronized successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();
