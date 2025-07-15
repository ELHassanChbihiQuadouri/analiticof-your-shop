module.exports = (sequelize, DataTypes) => {
  const Shop = sequelize.define('Shop', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    importMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Shop.associate = (models) => {
    Shop.belongsTo(models.User, { foreignKey: 'userId' });           // المدير
    Shop.hasMany(models.User, { foreignKey: 'shopId' });             // الموظفين
    Shop.hasMany(models.UserRole, { foreignKey: 'shopId' });         // الأدوار
  };

  return Shop;
};
