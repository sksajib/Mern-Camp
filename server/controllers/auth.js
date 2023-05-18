const User = require("../Models/user");
const { nanoid } = require("nanoid");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helpers/auth");
// const nanoid = require("nanoid");
const register = async (req, res) => {
  // console.log("Register endpoint=>", req.body);

  let { name, email, password, confirmPassword, question, secret, photo } =
    req.body;
  const nameC = name.replaceAll(/\s+/g, " ");
  const secretC = secret.replaceAll(/\s+/g, " ");
  const passC = password.replaceAll(/\s+/g, "");

  //validation
  if (!nameC || nameC == " ") return res.status(400).send("Name is required");
  if (!email) return res.status(400).send("Email is required");
  const emailUpper = email.toUpperCase();
  if (!passC || passC.length < 8)
    return res
      .status(400)
      .send(
        "Password is required and should be minimum 8 characters & maximum 64 characters long"
      );
  const s1 = "Hello";
  const s2 = "Hello2";
  const match = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return true;
    } else {
      return false;
    }
  };

  if (password !== confirmPassword)
    return res.status(400).send("Passwords don't match");

  if (!question) return res.status(400).send("Select a question");
  if (!secretC || secretC == " ")
    return res.status(400).send("Answer is required");
  const nameClean = nameC.charAt(0).toUpperCase();
  const len = name.length;
  const name2 = nameC.substring(1, len + 1);
  name = nameClean + name2;
  const secretUpper = secretC.toUpperCase();
  const exist = await User.findOne({ email: emailUpper });
  if (exist) return res.status(400).send("Email is taken");
  //hash password
  const hashedPassword = await hashPassword(password);
  const user = new User({
    name,
    email: emailUpper,
    password: hashedPassword,
    question,
    secret: secretUpper,
    userName: nanoid(8),
    photo: "",
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
    const emailUpper = email.toUpperCase();
    const user = await User.findOne({ email: emailUpper });
    if (!user) return res.status(400).send("no user found");
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).send("wrong password");
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    user.password = undefined;
    user.secret = undefined;
    user.question = undefined;
    res.json({
      token,
      user,
    });
  } catch (err) {
    return res.status(400).send("try again");
  }
};
const currentUser = async (req, res) => {
  try {
    // console.log(req);
    //const user = await User.findById(req.auth._id);
    res.json({ ok: true });
    // res.json(user);
  } catch (err) {
    console.log(err);
    res.sendStatus(401);
    res.send("JWT Token expired");
  }
};
const forgotPassword = async (req, res) => {
  try {
    let { email, password, confirmPassword, question, secret } = req.body;
    const secretC = secret.replaceAll(/\s+/g, " ");
    const passC = password.replaceAll(/\s+/g, "");
    if (!email) return res.status(400).send("Email is required");
    if (!passC || passC.length < 8)
      return res
        .status(400)
        .send(
          "New Password is required and should be minimum 8 characters & maximum 64 characters long"
        );
    if (password !== confirmPassword)
      return res.status(400).send("Passwords don't match");
    if (!question) return res.status(400).send("Select a question");
    if (!secretC || secretC == " ")
      return res.status(400).send("Answer is required");
    const emailUpper = email.toUpperCase();
    console.log(emailUpper);
    const exist = await User.findOne({ email: emailUpper });
    if (!exist) return res.status(400).send("Please Enter Valid mail");
    if (exist) {
      //return res.status(200).send("User Found");
      const match = await comparePassword(password, exist.password);
      if (match)
        return res
          .status(400)
          .send("New Password and Old Password Can't be Same");
      if (!match) {
        const hashedPassword = await hashPassword(password);
        const questionMatch = question === exist.question && true;
        if (!questionMatch)
          return res.status(400).send("Select correct question");
        if (questionMatch) {
          const secretUpper = secretC.toUpperCase();
          const secretMatch = secretUpper === exist.secret;
          if (!secretMatch)
            return res.status(400).send("Give the Secret Answer Correctly");
          if (secretMatch) {
            const ok = await User.updateOne(
              { email: emailUpper },
              { password: hashedPassword }
            );
            return res.status(200).send("Password Updated Successfully");
          }
        }
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send("try again");
  }
};
const addPicture = async (req, res) => {
  try {
    const { email, data } = req.body;
    console.log(data.url);

    const ok = await User.updateOne({ email: email }, { photo: data.url });
    const user = await User.findOne({ email: email });
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    //console.log(user);
    user.password = undefined;
    user.secret = undefined;
    user.question = undefined;
    const user2 = { token, user };
    console.log(user2);
    res.send({
      token,
      user,
    });
    console.log(ok);
  } catch (err) {
    return res.status(400).send("Something Went Wrong");
  }
};
module.exports = { register, login, currentUser, forgotPassword, addPicture };
