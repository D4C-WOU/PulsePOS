require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 5000,

  DB_HOST: process.env.DB_HOST,

  DB_USER: process.env.DB_USER,

  DB_PASSWORD: process.env.DB_PASSWORD,

  DB_NAME: process.env.DB_NAME,

  JWT_SECRET: process.env.JWT_SECRET,
};
