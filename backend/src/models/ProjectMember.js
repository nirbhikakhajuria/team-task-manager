const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProjectMember = sequelize.define('ProjectMember', {
  role: {
    type: DataTypes.ENUM('admin', 'member'),
    defaultValue: 'member',
  },
});

module.exports = ProjectMember;