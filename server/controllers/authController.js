const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateJWTToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist)
      return res.status(400).json({ error: "User Email already exists" });

    // const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ username, email, password });
    const userToken = generateJWTToken(user._id);

    res.status(201).json({
      user: { id: user._id, username: user.username, email: user.email },
      token: userToken,
    });
  } catch (err) {
    res.status(500).json({ error: "Registration Failed" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid Credentials" });

    const token = generateJWTToken(user._id);

    res.status(200).json({
      user: { id: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login Failed" });
  }
};
