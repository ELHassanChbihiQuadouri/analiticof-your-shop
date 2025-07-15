const express = require('express');
const cors = require('cors');
const db = require('./models'); // ✅ تحميل جميع الموديلات
const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shop');
const ordersRoutes = require('./routes/orders');
const dashboardRoutes = require('./routes/dashboard');
const userRolesRoutes = require('./routes/userRoles');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/user-roles', userRolesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/auth', authRoutes);

// Debug logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ✅ دالة تعبئة الأدوار
async function seedRoles() {
  const roles = ['Manager', 'Sales', 'Viewer'];
  for (const roleName of roles) {
    await db.Role.findOrCreate({ where: { name: roleName } });
  }
  console.log('Roles seeding completed.');
}

// بدء الاتصال وقاعدة البيانات
db.sequelize.sync()
  .then(async () => {
    console.log('Database synced');
    await seedRoles(); // تعبئة الأدوار
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });
