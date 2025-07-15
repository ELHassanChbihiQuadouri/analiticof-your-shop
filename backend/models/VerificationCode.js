module.exports = (sequelize, DataTypes) => {
  const VerificationCode = sequelize.define('VerificationCode', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(6), // رمز مكون من 6 أرقام
      allowNull: false,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Roles', key: 'id' },
      onDelete: 'CASCADE',
    },
    shopId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Shops', key: 'id' },
      onDelete: 'CASCADE',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    tableName: 'VerificationCodes',
    timestamps: true,
    updatedAt: false,
  });

  // لا نحتاج associate الآن إلا إذا كنت ستربطه بـ Role أو Shop مباشرة لاحقًا
  VerificationCode.associate = (models) => {
    // يمكن تفعيل هذه لاحقًا إذا أردت جلب الدور والمتجر عبر include
    // VerificationCode.belongsTo(models.Role, { foreignKey: 'roleId' });
    // VerificationCode.belongsTo(models.Shop, { foreignKey: 'shopId' });
  };

  return VerificationCode;
};
