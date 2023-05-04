const User = require("../Models/user");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helpers/auth");

const register = async (req, res) => {
  // console.log("Register endpoint=>", req.body);

  let { name, email, password, confirmPassword, question, secret } = req.body;
  const nameC = name.replaceAll(/\s+/g, " ");
  const secretC = secret.replaceAll(/\s+/g, " ");
  const passC = password.replaceAll(/\s+/g, "");

  //validation
  if (!nameC || nameC == " ") return res.status(400).send("Name is required");
  if (!email) return res.status(400).send("Email is required");
  if (!passC || passC.length < 8)
    return res
      .status(400)
      .send(
        "Password is required and should be minimum 8 characters & maximum 64 characters long"
      );
  const s1 = "Hello";
  const s2 = "Hello2";
  console.log(password !== confirmPassword);
  const match = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return true;
    } else {
      return false;
    }
  };
  console.log(typeof password);

  if (password !== confirmPassword)
    return res.status(400).send("Passwords don't match");

  if (!question) return res.status(400).send("Select a question");
  if (!secretC || secretC == " ")
    return res.status(400).send("Answer is required");
  const nameClean = nameC.charAt(0).toUpperCase();
  const len = name.length;
  const name2 = nameC.substring(1, len + 1);
  name = nameClean + name2;
  const exist = await User.findOne({ email });
  if (exist) return res.status(400).send("Email is taken");
  //hash password
  const hashedPassword = await hashPassword(password);
  const user = new User({
    name,
    email,
    password: hashedPassword,
    question,
    secret,
  });
  try {
    await user.save();
    return res.json({
      ok: true,
    });
  } catch (err) {
    console.log("Register failed =>", err);
    return res.status(400).send("Error,Try again");
  }
};
const login = async (req, res) => {
  try {
    //
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("no user found");
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).send("wrong password");
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    user.password = undefined;
    user.secret = undefined;
    user.question = undefined;
    res.json({
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send("try again");
  }
};
module.exports = { register, login };
