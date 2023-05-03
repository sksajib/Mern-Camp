const user = require("../Models/user");
const { hashPassword } = require("../helpers/auth");
const data = async (req, res) => {
  // console.log("Register endpoint=>", req.body);

  const { name, email, password, question, secret } = req.body;
  //validation
  if (!name) return res.status(400).send("Name is required");
  if (!email) return res.status(400).send("Email is required");
  if (!password || password.length < 8)
    return res
      .status(400)
      .send(
        "Password is required and should be minimum 8 characters & maximum 64 characters long"
      );
  if (!question) return res.status(400).send("Select a question");
  if (!secret) return res.status(400).send("Answer is required");
  const exist = await user.findOne({ email });
  if (exist) return res.status(400).send("Email is taken");
  //hash password
};
module.exports = data;
