'use struct';

require('dotenv').config()
const Sequelize = require('sequelize');
const SequelizeVault = require('sequelize-vault');

let conf = {};

// sequelize-vault
SequelizeVault.Vault.app = 'express';

if (process.env.DB_USER && process.env.DB_PASS) {
  SequelizeVault.Vault.enabled = true;
  SequelizeVault.Vault.convergented = true;
  SequelizeVault.Vault.token = process.env.VAULT_TOKEN;
  SequelizeVault.Vault.address = process.env.VAULT_ADDR;
  conf = {
    database: 'express',
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    operatorsAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
} else {
  conf = {
    database: 'test',
    dialect: 'sqlite',
    username: 'root',
    password: '',
    storage: ':memory:',
    operatorsAliases: false,
  }
}

// sequelize
const sequelize = new Sequelize(conf);

const schema = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: Sequelize.STRING,
  email_encrypted: Sequelize.STRING,
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE,
};

const User = sequelize.define('user', {
  username: Sequelize.STRING,
  email_encrypted: Sequelize.STRING,
  email: Sequelize.VIRTUAL,
}, {
  tableName: 'users',
  underscored: true,
});

SequelizeVault.default(User);

var db = {};
db.user = User;
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.schema = schema;

module.exports = db;
