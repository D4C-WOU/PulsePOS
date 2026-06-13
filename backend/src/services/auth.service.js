const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (email, password) => {
  const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  if (!users.length) {
    throw new Error("User not found");
  }

  const user = users[0];

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
    },
  };
};

module.exports = {
  login,
};
