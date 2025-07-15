require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const db = require('../models');
const User = db.User;
const Role = db.Role;
const UserRole = db.UserRole;
const Shop = db.Shop;

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// إعداد nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

// ✅ تسجيل المدير فقط
router.post('/signup',
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, role } = req.body;

    try {
      if (role !== 'Manager') {
        return res.status(403).json({ msg: 'Only Managers can sign up directly. Other users must be added by a Manager.' });
      }

      let user = await User.findOne({ where: { email } });
      if (user) return res.status(400).json({ msg: 'User already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = crypto.randomBytes(32).toString('hex');

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        verificationToken,
        isVerified: false,
      });

      const shop = await Shop.create({
        userId: user.id,
        name: `${name}'s Shop`,
        url: 'http://default-url.com',
        platform: 'default-platform',
        importMethod: 'manual'
      });

      await user.update({ shopId: shop.id });
      
      const roleObj = await Role.findOne({ where: { name: role } });
      if (!roleObj) return res.status(400).json({ msg: 'Invalid role' });

      await UserRole.create({
        userId: user.id,
        shopId: shop.id,
        roleId: roleObj.id,
      });

      const verificationUrl = `http://localhost:5000/api/auth/verify-email?token=${verificationToken}`;
      const mailOptions = {
        from: `"AnaliticOf Your Shop" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Please verify your email',
        html: `<p>Hello ${user.name},</p>
               <p>Please click this link to verify your email:</p>
               <a href="${verificationUrl}">${verificationUrl}</a>`
      };
      await transporter.sendMail(mailOptions);

      res.status(201).json({
        msg: 'Registration successful! Please check your email to verify your account.',
        redirect: '/login'
      });

    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }
);

// ✅ تفعيل البريد
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) return res.status(400).send('Invalid or expired token');

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.send('Email verified successfully! You can now login.');

  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// ✅ تسجيل الدخول
router.post('/login',
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').exists().withMessage('Password is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

      if (!user.isVerified) {
        return res.status(403).json({ msg: 'Please verify your email before logging in.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

      const userRole = await UserRole.findOne({
        where: { userId: user.id },
        include: ['Role', 'Shop']
      });
      if (!userRole) return res.status(400).json({ msg: 'User role not found' });

      const roleName = userRole.Role ? userRole.Role.name : null;
      const shopId = userRole.Shop ? userRole.Shop.id : null;

      if ((roleName === 'Viewer' || roleName === 'Sales') && !shopId) {
        return res.status(403).json({ msg: 'Access denied. User must be linked to a shop.' });
      }

      const token = jwt.sign({ id: user.id, role: roleName }, JWT_SECRET, { expiresIn: '1h' });

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: roleName,
          needsShopSetup: roleName === 'Manager' && (!shopId || userRole.Shop.url === 'http://default-url.com')
        }
      });

    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
