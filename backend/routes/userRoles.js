const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const router = express.Router();

const db = require('../models');
const User = db.User;
const Shop = db.Shop;
const Role = db.Role;
const UserRole = db.UserRole;
const VerificationCode = db.VerificationCode;

const authenticateToken = require('../middleware/authenticateToken');

// إعداد البريد
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

// 🔐 دالة لمعرفه الدور الحالي للمستخدم
async function getUserContext(userId) {
  const userRole = await UserRole.findOne({
    where: { userId },
    include: [Role]
  });

  if (!userRole) return null;
  return {
    role: userRole.Role.name,
    shopId: userRole.shopId
  };
}

// ✅ إرسال رمز تحقق لإضافة مستخدم
router.post('/add', authenticateToken, async (req, res) => {
  const { email, roleName } = req.body;

  try {
    const context = await getUserContext(req.user.id);
    if (!context) return res.status(403).json({ msg: 'Access denied' });
    if (context.role !== 'Manager') return res.status(403).json({ msg: 'Only Managers can add users' });

    const role = await Role.findOne({ where: { name: roleName } });
    if (!role) return res.status(400).json({ msg: 'Invalid role' });

    const userToAdd = await User.findOne({ where: { email } });
    if (userToAdd) return res.status(400).json({ msg: 'User already exists' });

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    await VerificationCode.create({
      email,
      code: verificationCode,
      roleId: role.id,
      shopId: context.shopId,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    const mailOptions = {
      from: `"AnaliticOf Your Shop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verification Code to Join Your Shop',
      html: `
        <p>You are invited as <strong>${roleName}</strong> to join the shop.</p>
        <p>Your verification code is: <strong>${verificationCode}</strong></p>
        <p>Please use this code to complete your registration.</p>
      `
    };
    await transporter.sendMail(mailOptions);

    res.json({ msg: 'Verification code sent to user email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ التحقق من الرمز وإنشاء الحساب
router.post('/verify', async (req, res) => {
  const { email, code, password, name } = req.body;

  try {
    const record = await VerificationCode.findOne({ where: { email, code } });
    if (!record) return res.status(400).json({ msg: 'Invalid verification code' });

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: true,
      shopId: record.shopId
    });

    await UserRole.create({
      userId: newUser.id,
      shopId: record.shopId,
      roleId: record.roleId,
    });

    await record.destroy();
    res.json({ msg: 'User registered successfully. You can now login.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ عرض كل المستخدمين المرتبطين بالمتجر
router.get('/', authenticateToken, async (req, res) => {
  try {
    const context = await getUserContext(req.user.id);
    if (!context) return res.status(403).json({ msg: 'Unauthorized' });

    const usersRoles = await UserRole.findAll({
      where: { shopId: context.shopId },
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Role, attributes: ['name'] }
      ]
    });

    res.json(usersRoles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ تحديث دور مستخدم (مدير فقط)
router.put('/update/:userRoleId', authenticateToken, async (req, res) => {
  const { roleName } = req.body;
  const { userRoleId } = req.params;

  try {
    const context = await getUserContext(req.user.id);
    if (!context || context.role !== 'Manager') {
      return res.status(403).json({ msg: 'Only Managers can update roles' });
    }

    const userRole = await UserRole.findOne({
      where: { id: userRoleId, shopId: context.shopId },
      include: [Role]
    });
    if (!userRole) return res.status(404).json({ msg: 'UserRole not found' });

    const newRole = await Role.findOne({ where: { name: roleName } });
    if (!newRole) return res.status(400).json({ msg: 'Invalid role' });

    userRole.roleId = newRole.id;
    await userRole.save();

    res.json({ msg: 'User role updated successfully', userRole });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ حذف مستخدم (مدير فقط)
router.delete('/delete/:userRoleId', authenticateToken, async (req, res) => {
  const { userRoleId } = req.params;

  try {
    const context = await getUserContext(req.user.id);
    if (!context || context.role !== 'Manager') {
      return res.status(403).json({ msg: 'Only Managers can delete users' });
    }

    const userRole = await UserRole.findOne({
      where: { id: userRoleId, shopId: context.shopId }
    });
    if (!userRole) return res.status(404).json({ msg: 'UserRole not found' });

    await userRole.destroy();
    res.json({ msg: 'User removed from shop successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ جلب الدور الحالي
router.get('/current-role', authenticateToken, async (req, res) => {
  try {
    const context = await getUserContext(req.user.id);
    if (!context) return res.status(404).json({ msg: 'User role not found' });

    res.json({ roleName: context.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
