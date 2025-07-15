module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    shopId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Shops', key: 'id' }
    },
    customer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Shipped', 'Delivered', 'Cancelled'),
      allowNull: false,
      defaultValue: 'Pending'
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Order.associate = (models) => {
    Order.belongsTo(models.Shop, { foreignKey: 'shopId' });
  };

  return Order;
};
