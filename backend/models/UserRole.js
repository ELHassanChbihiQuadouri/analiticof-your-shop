module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRole', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
    },
    shopId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Shops', key: 'id' },
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Roles', key: 'id' },
    },
  }, {
    timestamps: false,
  });

  UserRole.associate = (models) => {
    UserRole.belongsTo(models.User, { foreignKey: 'userId' });
    UserRole.belongsTo(models.Shop, { foreignKey: 'shopId' });
    UserRole.belongsTo(models.Role, { foreignKey: 'roleId' });
  };

  return UserRole;
};
