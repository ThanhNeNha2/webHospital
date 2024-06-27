import db from "../models/index";
import CRUDService from "../services/CRUDService";

//
let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render("homePage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (e) {
    console.log(e);
  }
};

//
let getCRUD = (req, res) => {
  return res.render("crud.ejs");
};

//
let postCRUD = async (req, res) => {
  await CRUDService.createNewUser(req.body);
  return res.send("trang postCRUD");
};

//
let displayGetCRUD = async (req, res) => {
  let data = await CRUDService.getAllUser();
  return res.render("display-CRUD.ejs", { dataTable: data });
};

//
let getEditCRUD = async (req, res) => {
  let userid = req.query.id;
  if (userid) {
    let userData = await CRUDService.getUserInfoById(userid);
    return res.render("editCRUD.ejs", {
      user: userData,
    });
  } else {
    return res.send("Don't have user");
  }
};

let putCRUD = async (req, res) => {
  let data = req.body;
  let allUsers = await CRUDService.updateUser(data);
  return res.render("display-CRUD.ejs", {
    dataTable: allUsers,
  });
};
let deleteCRUD = async (req, res) => {
  if (req.query.id) {
    let id = req.query.id;
    let userAll = await CRUDService.deleteUserById(id);
    return res.render("display-CRUD.ejs", { dataTable: userAll });
  } else {
    return res.send("Khong tim thay user");
  }
};
module.exports = {
  getHomePage: getHomePage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  displayGetCRUD: displayGetCRUD,
  getEditCRUD: getEditCRUD,
  putCRUD: putCRUD,
  deleteCRUD: deleteCRUD,
};
