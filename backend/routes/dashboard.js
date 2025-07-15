const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');

const db = require('../models');
const Order = db.Order;
const Shop = db.Shop;
const UserRole = db.UserRole;

const router = express.Router();

// ✅ إحصائيات المتجر للمستخدم الحالي
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // ✅ استخراج shopId من UserRole بدل الاعتماد على userId
    const userRole = await UserRole.findOne({ where: { userId: req.user.id } });
    if (!userRole) return res.status(404).json({ msg: 'User is not linked to any shop.' });

    const shop = await Shop.findOne({ where: { id: userRole.shopId } });
    if (!shop) return res.status(404).json({ msg: 'Shop not found.' });

    const orders = await Order.findAll({ where: { shopId: shop.id } });

    if (orders.length === 0) {
      return res.json({
        averageOrderValue: 0,
        monthlyGrowthRate: 0,
        cancellationRate: 0,
      });
    }

    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalSales / orders.length;

    const salesByMonth = {};
    orders.forEach(order => {
      const date = new Date(order.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      salesByMonth[monthKey] = (salesByMonth[monthKey] || 0) + order.total;
    });

    const months = Object.keys(salesByMonth).sort();

    let monthlyGrowthRate = 0;
    if (months.length >= 2) {
      const lastMonthSales = salesByMonth[months[months.length - 1]];
      const prevMonthSales = salesByMonth[months[months.length - 2]];
      monthlyGrowthRate = prevMonthSales === 0
        ? 100
        : ((lastMonthSales - prevMonthSales) / prevMonthSales) * 100;
    }

    const cancelledCount = orders.filter(o => o.status === 'Cancelled').length;
    const cancellationRate = (cancelledCount / orders.length) * 100;

    res.json({
      averageOrderValue: averageOrderValue.toFixed(2),
      monthlyGrowthRate: monthlyGrowthRate.toFixed(2),
      cancellationRate: cancellationRate.toFixed(2),
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
