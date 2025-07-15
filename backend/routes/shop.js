const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');

const db = require('../models');
const Shop = db.Shop;
const UserRole = db.UserRole;
const Role = db.Role;

const router = express.Router();

// 🧠 دالة لجلب السياق: الدور و shopId
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

// ✅ جلب بيانات المتجر المرتبط بالمستخدم
router.get('/', authenticateToken, async (req, res) => {
  try {
    const context = await getUserContext(req.user.id);
    if (!context) return res.status(404).json({ msg: 'User is not linked to a shop.' });

    const shop = await Shop.findOne({ where: { id: context.shopId } });
    if (!shop) return res.status(404).json({ msg: 'Shop not found.' });

    res.json(shop);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ إنشاء أو تحديث المتجر (يسمح فقط للـ Manager)
router.post('/setup', authenticateToken, async (req, res) => {
  const { name, url, platform, importMethod } = req.body;

  if (!name || !url || !platform || !importMethod) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
    const context = await getUserContext(req.user.id);
    if (!context || context.role !== 'Manager') {
      return res.status(403).json({ msg: 'Only Managers can update shop settings.' });
    }

    let shop = await Shop.findOne({ where: { userId: req.user.id } });

    if (shop) {
      shop.name = name;
      shop.url = url;
      shop.platform = platform;
      shop.importMethod = importMethod;
      await shop.save();
    } else {
      shop = await Shop.create({
        userId: req.user.id,
        name,
        url,
        platform,
        importMethod,
      });
    }

    res.json(shop);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ جلب جميع المتاجر (اختياري)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const shops = await Shop.findAll();
    res.json(shops);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
