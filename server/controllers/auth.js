const User = require("../Models/user");
const mongoose = require("mongoose");
const { Schema } = mongoose;
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
  //const passC = password.replaceAll(/\s+/g, "");

  //validation
  if (!nameC || nameC == " ") return res.status(400).send("Name is required");
  if (!email) return res.status(400).send("Email is required");
  const emailUpper = email.toUpperCase();
  if (!password || password.length < 8)
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
const updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      oldPassword,
      password,
      confirmPassword,
      secret,
      question,
      image,
      id,
      userName,
      changeSecret,
      changePassword,
    } = req.body;
    const user = await User.findById(id);
    const nameC = name.replaceAll(/\s+/g, " ");
    const hasWhiteSpace = /\s/.test(userName);

    if (hasWhiteSpace === true)
      res.status(400).send("User Name can't have white space");
    const hasAlphaNumeric = /^[a-zA-Z0-9]+$/.test(userName);
    if (hasAlphaNumeric === false)
      return res
        .status(400)
        .send("User Name should only contain AlphaNumeric characters");

    if (userName.length !== 8)
      return res.status(400).send("User Name should be 8 characters long");
    if (
      hasWhiteSpace === false &&
      hasAlphaNumeric === true &&
      userName.length === 8
    ) {
      const users = await User.find({ userName: userName });
      for (let i = 0; i < users.length; i++) {
        if (users[i]._id != req.auth._id) {
          console.log(users[i]._id, " ", id);
          return res
            .status(400)
            .send("User Name Not Available, Choose Another One");
        }
      }
    }

    if (!name || nameC === " ") return res.status(400).send("Name is required");
    if (!email) return res.status(400).send("Email is required");
    const hasWhiteSpaceEmail = /\s/.test(email);
    if (hasWhiteSpaceEmail === true)
      return res.status(400).send("Email can't have white space");
    const emailUpper = email.toUpperCase();
    if (email && hasWhiteSpaceEmail === false) {
      const users = await User.find({ email: emailUpper });
      for (let i = 0; i < users.length; i++) {
        if (users[i]._id != req.auth._id) {
          return res.status(400).send("Email is already used");
        }
      }
    }
    const match = await comparePassword(oldPassword, user.password);
    if (!match) return res.status(400).send("Current Password is not Correct");
    if (match) {
      if (changePassword && !changeSecret) {
        if (!password || password.length < 8) {
          return res
            .status(400)
            .send(
              "Enter Your new password that should be minimum 8 characters long"
            );
        }

        if (password !== confirmPassword) {
          return res.status(400).send("New Password Don't match");
        }
        if (password === oldPassword) {
          return res
            .status(400)
            .send("New Password and old Password can't be same");
        }
        if (
          password &&
          password.length >= 8 &&
          password === confirmPassword &&
          password !== oldPassword
        ) {
          const hashedPassword = await hashPassword(password);

          const update = {
            $set: {
              userName: userName,
              name: nameC,
              email: emailUpper,
              photo: image,
              password: hashedPassword,
            },
          };
          const ok = await User.updateOne({ _id: id }, update);
          const user = await User.findById(id);
          const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
          });
          //console.log(user);
          user.password = undefined;
          user.secret = undefined;
          user.question = undefined;
          const user2 = { token, user };
          console.log(user2);
          return res.json({
            token,
            user,
          });
        }
      }
      if (changePassword && changeSecret) {
        if (!password || password.length < 8) {
          return res
            .status(400)
            .send(
              "Enter Your new password that should be minimum 8 characters long"
            );
        }

        if (password !== confirmPassword) {
          return res.status(400).send("New Password Don't match");
        }
        if (password === oldPassword) {
          return res
            .status(400)
            .send("New Password and old Password can't be same");
        }
        if (
          password &&
          password.length >= 8 &&
          password === confirmPassword &&
          password !== oldPassword
        ) {
          const secretC = secret.replaceAll(/\s+/g, " ");
          if (secretC === " ")
            return res
              .status(400)
              .send("Enter Valid Answer to secret question");
          const secretUpper = secretC.toUpperCase();
          const hashedPassword = await hashPassword(password);
          if (secret && secretC !== " ") {
            const update = {
              $set: {
                userName: userName,
                name: nameC,
                email: emailUpper,
                photo: image,
                password: hashedPassword,
                question: question,
                secret: secretUpper,
              },
            };
            const ok = await User.updateOne({ _id: id }, update);
            const user = await User.findById(id);
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "1d",
            });
            //console.log(user);
            user.password = undefined;
            user.secret = undefined;
            user.question = undefined;
            const user2 = { token, user };
            console.log(user2);
            return res.json({
              token,
              user,
            });
          }
        }
      }
      if (!changePassword && changeSecret) {
        const secretC = secret.replaceAll(/\s+/g, " ");
        if (secretC === " ")
          return res.status(400).send("Enter Valid Answer to secret question");
        const secretUpper = secretC.toUpperCase();
        if (secret && secretC !== " ") {
          const update = {
            $set: {
              userName: userName,
              name: nameC,
              email: emailUpper,
              photo: image,
              question: question,
              secret: secretUpper,
            },
          };
          const ok = await User.updateOne({ _id: id }, update);
          const user = await User.findById(id);
          const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
          });
          //console.log(user);
          user.password = undefined;
          user.secret = undefined;
          user.question = undefined;
          const user2 = { token, user };
          console.log(user2);
          return res.json({
            token,
            user,
          });
        }
      }
      if (!changePassword && !changeSecret) {
        const update = {
          $set: {
            userName: userName,
            name: nameC,
            email: emailUpper,
            photo: image,
          },
        };

        const ok1 = await User.updateOne(
          { _id: req.auth._id },
          { userName: userName }
        );
        const ok2 = await User.updateOne(
          { _id: req.auth._id },
          { name: nameC }
        );
        const ok3 = await User.updateOne(
          { _id: req.auth._id },
          { email: emailUpper }
        );
        const ok4 = await User.updateOne(
          { _id: req.auth._id },
          { photo: image }
        );
        const user = await User.findById(req.auth._id);
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        //console.log(user);
        user.password = undefined;
        user.secret = undefined;
        user.question = undefined;
        //const user = { token, user3 };
        //console.log(user2);
        console.log(user);
        return res.json({
          token,
          user,
        });
      }
    }
  } catch (err) {
    console.log(err);
    return res.send(400).status(err);
  }
};
const findPeople = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    //user.following
    let following = user.following;
    let followers = user.followers;
    following.push(user._id);
    if (user.pendingRequests) {
      let pending = user.pendingRequests;
      for (let i = 0; i < pending.length; i++) {
        following.push(pending[i]);
      }
    }
    if (followers) {
      for (let i = 0; i < followers.length; i++) {
        following.push(followers[i]);
      }
    }
    const people = await User.find({ _id: { $nin: following } }).limit(20);

    if (people.length > 0) {
      for (let i = 0; i < people.length; i++) {
        people[i].email = undefined;
        people[i].password = undefined;
        people[i].question = undefined;
        people[i].userName = undefined;
        people[i].secret = undefined;
        people[i].following = undefined;
        people[i].followers = undefined;
        people[i].pendingRequests = undefined;
        people[i].createdAt = undefined;
        people[i].updatedAt = undefined;
        people[i].__v = undefined;
        people[i].createdAt = undefined;
      }
    }
    console.log(people);
    res.json(people);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};
const sentRequest = async (req, res) => {
  try {
    const { _id, id } = req.body;
    console.log(_id, " ", id);

    const user = await User.findById(req.auth._id);
    const pendingUsers = user.pendingRequests;
    const requestReceivedUser = await User.findById(_id);
    const pendingFollwers = requestReceivedUser.followers;
    let exist = 0;
    if (pendingFollwers) {
      for (let i = 0; i < pendingFollwers.length; i++) {
        if (req.auth._id == pendingFollwers[i]) {
          exist = 1;
          var a = pendingFollwers.splice(i, 1);
          const ok = await User.updateOne(
            { _id: _id },
            {
              $set: {
                followers: pendingFollwers,
              },
            }
          );
          break;
        }
      }

      if (exist === 0) {
        pendingFollwers.push(req.auth._id);
        const ok = await User.updateOne(
          { _id: _id },
          {
            $set: {
              followers: pendingFollwers,
            },
          }
        );
      }
    }
    let followerArray = [];
    followerArray[0] = req.auth._id;
    if (!pendingFollwers) {
      const ok = await User.updateOne(
        { _id: _id },
        {
          $set: {
            followers: followerArray,
          },
        }
      );
    }
    if (pendingUsers) {
      for (let i = 0; i < pendingUsers.length; i++) {
        if (_id == pendingUsers[i]) {
          var a = pendingUsers.splice(i, 1);
          const ok = await User.updateOne(
            { _id: req.auth._id },
            {
              $set: {
                pendingRequests: pendingUsers,
              },
            }
          );
          const updateduser = await User.findById(req.auth._id);
          return res.send(updateduser);
        }
      }
    }
    let arrayRequests = [];
    if (user.pendingRequests) {
      pendingUsers.push(_id);
    }
    console.log(pendingUsers);
    if (!pendingUsers) {
      arrayRequests[0] = _id;
      console.log(arrayRequests);
      const ok = await User.updateOne(
        { _id: req.auth._id },
        {
          $set: {
            pendingRequests: arrayRequests,
          },
        }
      );
      const updateduser = await User.findById(req.auth._id);
      updateduser.password = undefined;
      updateduser.secret = undefined;
      updateduser.createdAt = undefined;
      updateduser.question = undefined;
      updateduser.updatedAt = undefined;
      updateduser.followers = undefined;
      updateduser.following = undefined;
      return res.send(updateduser);
    } else {
      const ok = await User.updateOne(
        { _id: req.auth._id },
        {
          $set: {
            pendingRequests: pendingUsers,
          },
        }
      );
      const updateduser = await User.findById(req.auth._id);
      updateduser.password = undefined;
      updateduser.secret = undefined;
      updateduser.createdAt = undefined;
      updateduser.question = undefined;
      updateduser.updatedAt = undefined;
      updateduser.followers = undefined;
      updateduser.following = undefined;
      return res.send(updateduser);
    }
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
};
const findSentRequest = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    let pending = user.pendingRequests;
    console.log(pending);
    if (pending) {
      const people = await User.find({ _id: pending }).limit(10);
      console.log(people);
      if (people.length > 0) {
        for (let i = 0; i < people.length; i++) {
          people[i].email = undefined;
          people[i].password = undefined;
          people[i].question = undefined;
          people[i].userName = undefined;
          people[i].secret = undefined;
          people[i].following = undefined;
          people[i].followers = undefined;
          people[i].pendingRequests = undefined;
          people[i].createdAt = undefined;
          people[i].updatedAt = undefined;
          people[i].__v = undefined;
          people[i].createdAt = undefined;
        }
      }
      console.log(people);
      return res.json(people);
    }
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
};
const cancelRequest = async (req, res) => {
  try {
    const person1Id = req.auth._id; //currently logged in user
    const person2Id = req.body._id; // User to whom request has been sent or cancel
    console.log(person1Id, " ", person2Id);
    const person1 = await User.findById(person1Id);
    const person2 = await User.findById(person2Id);
    const pendingRequests = person1.pendingRequests;
    console.log(pendingRequests);
    const followRequest = person2.followers;
    console.log(followRequest);
    let followers = [];
    if (!followRequest) {
      followers[0] = person1Id;
      const ok = await User.updateOne(
        { _id: person2Id },
        {
          $set: {
            followers: followers,
          },
        }
      );
    }
    if (followRequest) {
      let count = 0;
      for (let i = 0; i < followRequest.length; i++) {
        if (followRequest[i] == person1Id) {
          count = 1;
          var a = followRequest.splice(i, 1);
          const ok = await User.updateOne(
            { _id: person2Id },
            { $set: { followers: followRequest } }
          );
          break;
        }
      }
      if (count === 0) {
        followRequest.push(person1Id);
        const ok = await User.updateOne(
          { _id: person2Id },
          { $set: { followers: followRequest } }
        );
      }
    }
    let personArray = [];
    if (!pendingRequests) {
      personArray[0] = person2Id;
      const ok = await User.updateOne(
        { _id: req.auth._id },
        {
          $set: {
            pendingRequests: personArray,
          },
        }
      );
      const updateduser = await User.findById(req.auth._id);
      updateduser.password = undefined;
      updateduser.secret = undefined;
      updateduser.createdAt = undefined;
      updateduser.question = undefined;
      updateduser.updatedAt = undefined;
      updateduser.followers = undefined;
      updateduser.following = undefined;
      return res.send(updateduser);
    }
    if (pendingRequests) {
      let count = 0;
      for (let i = 0; i < pendingRequests.length; i++) {
        if (pendingRequests[i] == person2Id) {
          count = 1;
          var a = pendingRequests.splice(i, 1);
          const ok = await User.updateOne(
            { _id: person1Id },
            { pendingRequests: pendingRequests }
          );
          break;
        }
      }
      if (count == 0) {
        pendingRequests.push(person2Id);
        const ok = await User.updateOne(
          { _id: person1Id },
          { pendingRequests: pendingRequests }
        );
      }
      const updateduser = await User.findById(req.auth._id);
      updateduser.password = undefined;
      updateduser.secret = undefined;
      updateduser.createdAt = undefined;
      updateduser.question = undefined;
      updateduser.updatedAt = undefined;
      updateduser.followers = undefined;
      updateduser.following = undefined;
      return res.send(updateduser);
    }
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
};
const findRequest = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    let pending = user.followers;
    console.log(pending);
    if (pending) {
      const people = await User.find({ _id: pending }).limit(10);
      console.log(people);
      if (people.length > 0) {
        for (let i = 0; i < people.length; i++) {
          people[i].email = undefined;
          people[i].password = undefined;
          people[i].question = undefined;
          people[i].userName = undefined;
          people[i].secret = undefined;
          people[i].following = undefined;
          people[i].followers = undefined;
          people[i].pendingRequests = undefined;
          people[i].createdAt = undefined;
          people[i].updatedAt = undefined;
          people[i].__v = undefined;
          people[i].createdAt = undefined;
        }
      }
      console.log(people);
      return res.json(people);
    }
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
};

const acceptRequest = async (req, res) => {
  try {
    const person1Id = req.auth._id; //currently logged in user
    const person2Id = req.body._id; // User whose request will be accepted
    console.log(person1Id, " ", person2Id);
    const person1 = await User.findById(person1Id);
    const person2 = await User.findById(person2Id);
    const followers = person1.followers;
    const person1Following = person1.following;
    const person2Following = person2.following;
    console.log(followers);
    const pendingRequests = person2.pendingRequests;
    for (let i = 0; i < pendingRequests.length; i++) {
      if (pendingRequests[i] == person1Id) {
        pendingRequests.splice(i, 1);
        break;
      }
    }
    const ok1 = await User.updateOne(
      { _id: person2Id },
      {
        $set: {
          pendingRequests: pendingRequests,
        },
      }
    );
    let person2Friends = [];
    if (!person2Following) {
      person2Friends[0] = person1Id;
      const ok2 = await User.updateOne(
        { _id: person2Id },
        {
          $set: {
            following: person2Friends,
          },
        }
      );
    }
    if (person2Following) {
      person2Following.push(person1Id);
      const ok2 = await User.updateOne(
        { _id: person2Id },
        {
          $set: {
            following: person2Following,
          },
        }
      );
    }
    if (!person1Following) {
      let friends = [];
      friends[0] = person2Id;
      const ok2 = await User.updateOne(
        { _id: person1Id },
        {
          $set: {
            following: friends,
          },
        }
      );
    }
    if (person1Following) {
      person1Following.push(person2Id);
      const ok2 = await User.updateOne(
        { _id: person1Id },
        {
          $set: {
            following: person1Following,
          },
        }
      );
    }
    for (let i = 0; i < followers.length; i++) {
      if ((followers[i] = person2Id)) {
        followers.splice(i, 1);
        break;
      }
    }
    const ok4 = await User.updateOne(
      { _id: person1Id },
      {
        $set: {
          followers: followers,
        },
      }
    );
    const updateduser = await User.findById(req.auth._id);
    updateduser.password = undefined;
    updateduser.secret = undefined;
    updateduser.createdAt = undefined;
    updateduser.question = undefined;
    updateduser.updatedAt = undefined;
    updateduser.followers = undefined;
    updateduser.following = undefined;
    return res.send(updateduser);
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
};

const deleteRequest = async (req, res) => {
  try {
    const person1Id = req.auth._id; //currently logged in user
    const person2Id = req.body._id; // User whose request will be accepted
    console.log(person1Id, " ", person2Id);
    const person1 = await User.findById(person1Id);
    const person2 = await User.findById(person2Id);
    const followers = person1.followers;
    console.log(followers);
    const pendingRequests = person2.pendingRequests;
    for (let i = 0; i < pendingRequests.length; i++) {
      if (pendingRequests[i] == person1Id) {
        pendingRequests.splice(i, 1);
        break;
      }
    }
    const ok = await User.updateOne(
      { _id: person2Id },
      {
        $set: {
          pendingRequests: pendingRequests,
        },
      }
    );
    for (let i = 0; i < followers.length; i++) {
      if (followers[i] == person2Id) {
        followers.splice(i, 1);
        break;
      }
    }
    const ok2 = await User.updateOne(
      { _id: person1Id },
      {
        $set: {
          followers: followers,
        },
      }
    );
    const updateduser = await User.findById(req.auth._id);
    updateduser.password = undefined;
    updateduser.secret = undefined;
    updateduser.createdAt = undefined;
    updateduser.question = undefined;
    updateduser.updatedAt = undefined;
    updateduser.followers = undefined;
    updateduser.following = undefined;
    return res.send(updateduser);
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
};
const findFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    const following = user.following;
    if (following) {
      const people = await User.find({ _id: following }).limit(3);
      console.log(people);
      if (people.length > 0) {
        for (let i = 0; i < people.length; i++) {
          people[i].email = undefined;
          people[i].password = undefined;
          people[i].question = undefined;
          people[i].userName = undefined;
          people[i].secret = undefined;
          people[i].following = undefined;
          people[i].followers = undefined;
          people[i].pendingRequests = undefined;
          people[i].createdAt = undefined;
          people[i].updatedAt = undefined;
          people[i].__v = undefined;
          people[i].createdAt = undefined;
        }
      }
      console.log(people);
      return res.json(people);
    }
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
};
const findFollowingAll = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    const following = user.following;
    if (following) {
      const people = await User.find({ _id: following });
      console.log(people);
      if (people.length > 0) {
        for (let i = 0; i < people.length; i++) {
          people[i].email = undefined;
          people[i].password = undefined;
          people[i].question = undefined;
          people[i].userName = undefined;
          people[i].secret = undefined;
          people[i].following = undefined;
          people[i].followers = undefined;
          people[i].pendingRequests = undefined;
          people[i].createdAt = undefined;
          people[i].updatedAt = undefined;
          people[i].__v = undefined;
          people[i].createdAt = undefined;
        }
      }
      console.log(people);
      return res.json(people);
    }
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
};

const unfollowPeople = async (req, res) => {
  try {
    const person1 = await User.findById(req.auth._id);
    const person2 = await User.findById(req.body._id);
    let person1Following = person1.following;
    let person2Following = person2.following;
    for (let i = 0; i < person1Following; i++) {
      if (person1Following[i] == req.body._id) {
        person1Following.splice(i, 1);
      }
    }
    for (let i = 0; i < person2Following; i++) {
      if (person2Following[i] == req.auth._id) {
        person2Following.splice(i, 1);
      }
    }

    const ok = await User.updateOne(
      { _id: req.auth._id },
      {
        $set: {
          following: person1Following,
        },
      }
    );
    const ok2 = await User.updateOne(
      { _id: req.body._id },
      {
        $set: {
          following: person2Following,
        },
      }
    );
    const updateduser = await User.findById(req.auth._id);
    updateduser.password = undefined;
    updateduser.secret = undefined;
    updateduser.createdAt = undefined;
    updateduser.question = undefined;
    updateduser.updatedAt = undefined;
    updateduser.followers = undefined;
    updateduser.following = undefined;
    return res.send(updateduser);
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
};
module.exports = {
  register,
  login,
  currentUser,
  forgotPassword,
  addPicture,
  updateProfile,
  findPeople,
  sentRequest,
  findSentRequest,
  cancelRequest,
  findRequest,
  acceptRequest,
  deleteRequest,
  findFollowing,
  findFollowingAll,
  unfollowPeople,
};
