module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    isVerified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    verificationToken: { type: DataTypes.STRING, allowNull: true },
    shopId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Shops',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });

  User.associate = (models) => {
    User.belongsTo(models.Shop, { foreignKey: 'shopId' });        // الموظف في متجر
    User.hasMany(models.UserRole, { foreignKey: 'userId' });      // له أدوار
    User.hasOne(models.Shop, { foreignKey: 'userId' });           // هو مدير لمتجر
  };

  return User;
};
