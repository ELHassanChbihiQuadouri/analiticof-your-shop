const sequelize = require('./config/db'); // عدّل المسار حسب مكان ملف الاتصال بقاعدة البيانات

async function resetDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    await sequelize.sync({ force: true });
    console.log('All tables dropped and recreated.');

    process.exit(0);
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

resetDatabase();
