// deleteAllUsers.js
const { Sequelize } = require('sequelize');
const db = require('./database'); // تأكد من استيراد الاتصال بقاعدة البيانات بشكل صحيح
const User = require('./models/User');

async function deleteAllUsers() {
  try {
    await db.authenticate();
    console.log('Database connected.');

    // حذف كل المستخدمين مع الحذف المتسلسل
    await User.destroy({ where: {}, truncate: true, cascade: true });
    console.log('All users deleted.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error deleting users:', error);
    process.exit(1);
  }
}

deleteAllUsers();
