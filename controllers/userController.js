const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
const User = require("../models/userModel");
const {
  registerValidation,
  loginValidation,
  emailValidation,
} = require("../services/userValidation");

const registerUser = async (req, res, next) => {
  // VALIDATION
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).json({ error: "Email already exists!" });

  // Hash password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);

  // Create new user
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.json({ user: user._id });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res) => {
  // VALIDATION
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // Check if email exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ error: "Email not found!" });

  const isValidPass = await bcrypt.compare(req.body.password, user.password);
  if (!isValidPass) return res.status(400).json({ error: "Invalid password!" });

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SCRT);
  res.header("auth-token", token).json({ token: token });
};

const generateOTP = async (req, res) => {
  const { error } = emailValidation(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // Check if email exist
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(400)
      .json({ error: "Email not found, create an account first" });

  const OTP = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  res.send(OTP);
};

const verifyOTP = (req, res) => {};

const getMe = (req, res) => {
  res.send(req.user);
};

module.exports = {
  registerUser,
  loginUser,
  generateOTP,
  getMe,
};
