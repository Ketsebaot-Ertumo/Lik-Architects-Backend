const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('Users', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
      set(value) {
        if (value) {
          this.setDataValue('email', value.toLowerCase());
        }
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      // defaultValue: 'user',
      defaultValue: 'admin',
    },
    confirmationCode: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  });

  User.beforeCreate(async (user) => {
    if (user.password) {
      user.password = await bcryptjs.hash(user.password, 10);
    }
  });

  User.prototype.comparePassword = async function (enteredPassword) {
    return await bcryptjs.compare(enteredPassword, this.password);
  };

  User.prototype.getJwtToken = function () {
    return jwt.sign({ id: this.id, fullName: this.fullName, email:this.email, role: this.role}, process.env.JWT_SECRET, { expiresIn: '6hr' });
  };

  return User;
}