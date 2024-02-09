const ErrorHttp = require("../models/modelError");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

//`````````REGISTER USER```````````
// POST: api/users/register
//UNPROTECTED
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, password2 } = req.body;

    if (!name || !email || !password) {
      return next(new ErrorHttp("Fill in all details", 422));
    }

    const newEmail = email.toLowerCase();
    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return next(new ErrorHttp("Email already exists", 422));
    }
    if (password.trim().length < 6) {
      return next(
        new ErrorHttp("Password should be atleast 6 characters", 422)
      );
    }
    if (password != password2) {
      return next(new ErrorHttp("Password did not match", 422));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email: newEmail,
      password: hashedPass,
    });
    res.status(201).json(`New User ${newUser.email} registered.`);
    console.log("New User Registerd from User Controller");
  } catch (error) {
    return next(new ErrorHttp("User registration faild", 422));
  }
};

//`````````LOGIN USER```````````
// POST: api/users/login
//UNPROTECTED
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHttp("Fill in all fields", 422));
    }
    const newEmail = email.toLowerCase();
    const user = await User.findOne({ email: newEmail });
    if (!user) {
      return next(new ErrorHttp("Email not registerd with us", 422));
    }
    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      return next(new ErrorHttp("Invalid Credentials", 422));
    }
    const { _id: id, name } = user;
    const token = jwt.sign({ id, name }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token, name, id });
    console.log("Login User from User Controller");
  } catch (error) {
    return next(
      new ErrorHttp("Login Failed, Please Check your credentials", 422)
    );
  }
};

//`````````User Profile```````````
// POST: api/users/:id
//PROTECTED
const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      return next(new ErrorHttp("User not found", 422));
    }
    res.status(200).json(user);
    console.log("All Users (getUser) from User Controller");
  } catch (error) {
    return next(new ErrorHttp(error));
  }
};

//````````````````````````````````Change Avatar Profile``````````````````````````````````````
// POST: api/users/change-avatar
//PROTECTED
const changeAvater = async (req, res, next) => {
  try {
    if (!req.files.avatar) {
      return next(new ErrorHttp("Please choose an image", 422));
    }
    //Fing user from database
    const user = await User.findById(req.user.id);
    //delete the avatar if exists
    if (user.avatar) {
      fs.unlink(path.join(__dirname, "..", "uploads", user.avatar), (err) => {
        if (err) {
          return next(new ErrorHttp(err));
        }
      });
    }

    const { avatar } = req.files;
    if (avatar.size > 5000000) {
      return next(
        new ErrorHttp("The Proflie is too large, try less then 500Kb", 422)
      );
    }

    let fileName;
    fileName = avatar.name;
    let splittedFilename = fileName.split(".");
    let newFileName =
      splittedFilename[0] +
      uuid() +
      "." +
      splittedFilename[splittedFilename.length - 1];
    //mv - move
    avatar.mv(
      path.join(__dirname, "..", "uploads", newFileName),
      async (err) => {
        if (err) {
          return next(new ErrorHttp(err));
        }
        const updatedAvatar = await User.findByIdAndUpdate(
          req.user.id,
          { avatar: newFileName },
          { new: true }
        );
        if (!updatedAvatar) {
          return next(new ErrorHttp("avatar couldnt been changed"), 422);
        }
        res.status(200).json(updatedAvatar);
      }
    );
    console.log("Image avatar chamged from User Controller");
  } catch (error) {
    return next(new ErrorHttp("error in catch block", 422));
  }
};

///////////////////`````````````````Edit User Details```````````````````////////////////////////
// POST: api/users/edit-user
//PROTECTED
const editUser = async (req, res, next) => {
  try {
    const { name, email, currentPassoword, newPassword, confirmPassword } =
      req.body;
    if (!name || !email || !currentPassoword || !newPassword) {
      return next(new ErrorHttp("Fill in all fields", 422));
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorHttp("user not found", 422));
    }

    const emailExist = await User.findOne({ email });

    if (emailExist && emailExist._id != req.user.id) {
      return next(new ErrorHttp("email already exists", 422));
    }

    const validateUserPassword = await bcrypt.compare(
      currentPassoword,
      user.password
    );

    if (!validateUserPassword) {
      return next(new ErrorHttp("Invalid Current Password", 422));
    }

    if (newPassword != confirmPassword) {
      return next(new ErrorHttp("New Passwords not matched", 422));
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    const newInfo = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, password: hash },
      { new: true } //It Will return the updated model to the varible
    );
    res.status(200).json(newInfo);
    console.log("Edit User from User Controller");
  } catch (error) {
    console.log("Catch in edit user");

    return next(new ErrorHttp(error, 422));
  }
};

///////////////////```````````````````````Get Authors```````````````````````////////////////////
// GET: api/users/authors
//UNPROTECTED
const getAuthors = async (req, res, next) => {
  try {
    const authors = await User.find().select("-password");
    res.json(authors);
  } catch (error) {
    return next(new ErrorHttp(error));
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAuthors,
  getUser,
  changeAvater,
  editUser,
};
