const userModel = require("../model/userModel");
const bycrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (id) => {
  const jwtkey = process.env.JWT_SECKRET_KEY;

  return jwt.sign({ id }, jwtkey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json("all fields are required");

    let user = await userModel.findOne({ email });

    if (user) return res.status(400).json("user already exist with this email");

    if (!validator.isEmail(email))
      return res.status(400).json("Enter a valid email");

    if (!validator.isStrongPassword(password))
      return res.status(400).json("Enter a strong password like Example@123");

    user = new userModel({ name, email, password });

    const hashed = await bycrypt.genSalt(10);
    user.password = await bycrypt.hash(user.password, hashed);

    await user.save();

    const token = createToken(user.id);

    res.status(200).json({ id: user.id, name, email, token });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await userModel.findOne({ email });

    if (!user) return res.status(400).json("invalid email");

    const isValidPass = await bycrypt.compare(password, user.password);

    if (!isValidPass) return res.status(400).json("invalid password");

    const token = createToken(user.id);

    res.status(200).json({ id: user.id, name: user.name, email, token });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const findUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    if (!userId) return res.status(400).json("userId is required");

    let user = await userModel.findById(userId);

    return res.status(200).json(user);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const getUsers = async (req, res) => {
  try {
    let user = await userModel.find({});

    return res.status(200).json(user);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

module.exports = { registerUser, loginUser, findUser, getUsers };
