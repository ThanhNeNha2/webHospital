import patientService from "../services/specialtyService";
let createSpecialty = async (req, res) => {
  try {
    let infor = await patientService.createSpecialty(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server....",
    });
  }
};
let getAllSpecialty = async (req, res) => {
  try {
    let infor = await patientService.getAllSpecialty(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server....",
    });
  }
};
let getDetailSpecialtyById = async (req, res) => {
  try {
    let infor = await patientService.getDetailSpecialtyById(
      req.query.id,
      req.query.location
    );
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server....",
    });
  }
};

module.exports = {
  createSpecialty: createSpecialty,
  getAllSpecialty,
  getDetailSpecialtyById
};
