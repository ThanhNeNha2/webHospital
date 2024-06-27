import bcrypt from "bcryptjs";
import db from "../models/index";

var salt = bcrypt.genSaltSync(10);

// *** CREATE NEW USER
let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassWordFormBcrypt = await hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashPassWordFormBcrypt,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phonenumber: data.phonenumber,
        gender: data.gender === 1 ? true : false,
        roleId: data.roleId,
      });
      resolve("ok create a new user success");
    } catch (e) {
      reject(e);
    }
  });
};

// **** READ TRONG DATA
let getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({ raw: true });
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

// ***BAM MAT KHAU
let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      var hashPassWord = await bcrypt.hashSync(password, salt);
      resolve(hashPassWord);
    } catch (e) {
      reject(e);
    }
  });
};
let getUserInfoById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
        raw: true,
      });
      if (user) {
        resolve(user);
      } else {
        resolve([]);
      }
    } catch (e) {
      reject(e);
    }
  });
};
let updateUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (user) {
        await user.update({
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
        });
        await user.save();
        let allUsers = await db.User.findAll();
        resolve(allUsers);
      } else {
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  });
};
let deleteUserById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (id) {
        await db.User.destroy({
          where: { id: id },
        });
        let dataAlls = db.User.findAll();
        resolve(dataAlls);
      } else {
        resolve([]);
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createNewUser: createNewUser,
  getAllUser: getAllUser,
  getUserInfoById: getUserInfoById,
  updateUser: updateUser,
  deleteUserById: deleteUserById,
};
