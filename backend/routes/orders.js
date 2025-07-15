const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');

const db = require('../models');
const Order = db.Order;
const Shop = db.Shop;
const UserRole = db.UserRole;
const Role = db.Role;

const router = express.Router();

// 🧠 دالة لمعرفة السياق الحالي للمستخدم (role + shopId)
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

// ✅ جلب كل الطلبات الخاصة بمتجر المستخدم الحالي
router.get('/', authenticateToken, async (req, res) => {
  try {
    const context = await getUserContext(req.user.id);
    if (!context) return res.status(403).json({ msg: 'User is not linked to a shop.' });

    const orders = await Order.findAll({
      where: { shopId: context.shopId },
      order: [['date', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ إضافة طلب جديد (غير مسموح لـ Viewer)
router.post('/add', authenticateToken, async (req, res) => {
  const { customer, total, status, date } = req.body;

  try {
    const context = await getUserContext(req.user.id);
    if (!context) return res.status(403).json({ msg: 'User is not linked to a shop.' });

    if (context.role === 'Viewer') {
      return res.status(403).json({ msg: 'Viewer role cannot add orders.' });
    }

    const order = await Order.create({
      shopId: context.shopId,
      customer,
      total,
      status,
      date,
    });

    res.json({ msg: 'Order added successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ تحديث حالة الطلب (غير مسموح لـ Viewer)
router.put('/update/:id', authenticateToken, async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  try {
    const context = await getUserContext(req.user.id);
    if (!context) return res.status(403).json({ msg: 'User is not linked to a shop.' });

    if (context.role === 'Viewer') {
      return res.status(403).json({ msg: 'Viewer role cannot update orders.' });
    }

    const order = await Order.findOne({ where: { id: orderId, shopId: context.shopId } });
    if (!order) return res.status(404).json({ msg: 'Order not found.' });

    const allowedStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ msg: 'Invalid status value' });
    }

    order.status = status;
    await order.save();

    res.json({ msg: 'Order updated successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
