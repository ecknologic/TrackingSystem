// config.js
const config = {
  db: {
    host: process.env.HOST,
    dbName: process.env.DB_NAME,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD
  }
};

module.exports = config;