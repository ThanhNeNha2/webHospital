import React, { Component } from "react";
import * as actions from "../../../store/actions";
import { connect } from "react-redux";
import "./ManageDoctor.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
// import style manually
import "react-markdown-editor-lite/lib/index.css";
import Select from "react-select";
import { LANGUAGES } from "../../../utils";
import { getDetailInforDoctor } from "../../../services/userService";
import { CRUD_ACTIONS } from "../../../utils";
import { FormattedMessage } from "react-intl";
const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // save to markdown table
      contentMarkdown: "",
      contentHTML: "",
      selectedOption: "",
      description: "",
      listDoctors: [],
      hasOldData: false,

      // Save to doctor infor table
      listPrice: [],
      listPayment: [],
      listProvince: [],
      listClinic: [],
      listSpecialty: [],
      selectedPrice: "",
      selectedPayment: "",
      selectedProvince: "",
      selectedClinic: "",
      selectedSpecialty: "",
      nameClinic: "",
      addressClinic: "",
      note: "",
      clinicId: "",
      specialtyId: "",
    };
  }

  handleEditorChange = ({ html, text }) => {
    this.setState({
      contentMarkdown: text,
      contentHTML: html,
    });
  };
  handleSaveContentMarkdown = () => {
    this.props.saveDetailDoctor({
      contentHTML: this.state.contentHTML,
      contentMarkdown: this.state.contentMarkdown,
      description: this.state.description,
      doctorId: this.state.selectedOption.value,
      action:
        this.state.hasOldData === true
          ? CRUD_ACTIONS.EDIT
          : CRUD_ACTIONS.CREATE,

      selectedPrice: this.state.selectedPrice.value,
      selectedPayment: this.state.selectedPayment.value,
      selectedProvince: this.state.selectedProvince.value,
      nameClinic: this.state.nameClinic,
      addressClinic: this.state.addressClinic,
      note: this.state.note,
      clinicId:
        this.state.selectedClinic && this.state.selectedClinic.value
          ? this.state.selectedClinic.value
          : "",
      specialtyId: this.state.selectedSpecialty.value,
    });
  };

  handleChangeSelect = async (selectedOption) => {
    this.setState({ selectedOption });
    let { listPayment, listProvince, listPrice, listSpecialty, listClinic } =
      this.state;
    let res = await getDetailInforDoctor(selectedOption.value);
    let nameClinic = "",
      provinceId = "",
      priceId = "",
      paymentId = "",
      note = "",
      addressClinic = "",
      findPaymentId = "",
      findPriceId = "",
      findProvinceId = "",
      selectedSpecialty = "",
      specialtyId = "",
      clinicId = "",
      selectedClinic = "";

    if (res && res.data && res.data.Doctor_Infor) {
      provinceId = res.data.Doctor_Infor.provinceId;
      priceId = res.data.Doctor_Infor.priceId;
      paymentId = res.data.Doctor_Infor.paymentId;
      nameClinic = res.data.Doctor_Infor.nameClinic;
      addressClinic = res.data.Doctor_Infor.addressClinic;
      note = res.data.Doctor_Infor.note;
      specialtyId = res.data.Doctor_Infor.specialtyId;
      clinicId = res.data.Doctor_Infor.clinicId;
      findPaymentId = listPayment.find((item) => {
        return item.value === paymentId;
      });
      findPriceId = listPrice.find((item) => {
        return item.value === priceId;
      });
      findProvinceId = listProvince.find((item) => {
        return item.value === provinceId;
      });
      selectedSpecialty = listSpecialty.find((item) => {
        return item && item.value === specialtyId;
      });
      selectedClinic = listClinic.find((item) => {
        return item && item.value === clinicId;
      });
    }

    if (res && res.errCode === 0 && res.data && res.data.Markdown) {
      let Markdown = res.data.Markdown;
      // set lại để hiển thị trên client
      this.setState({
        contentHTML: Markdown.contentHTML,
        contentMarkdown: Markdown.contentMarkdown,
        description: Markdown.description,
        hasOldData: true,
        nameClinic: nameClinic,
        addressClinic: addressClinic,
        note: note,
        selectedPayment: findPaymentId,
        selectedPrice: findPriceId,
        selectedProvince: findProvinceId,
        selectedSpecialty: selectedSpecialty,
        selectedClinic: selectedClinic,
      });
    } else {
      this.setState({
        contentHTML: "",
        contentMarkdown: "",
        description: "",
        hasOldData: false,
        nameClinic: "",
        addressClinic: "",
        note: "",
        selectedPayment: "",
        selectedPrice: "",
        selectedSpecialty: "",
        selectedProvince: "",
        selectedSpecialty: "",
        selectedClinic: "",
      });
    }
  };

  handleChangeSelectDoctorInfor = async (selectedOption, name) => {
    console.log("check name ", name);
    console.log("check selectedOption ", selectedOption);
    let nameSelect = name.name;
    let coppyState = { ...this.state };
    coppyState[nameSelect] = selectedOption;
    this.setState({
      ...coppyState,
    });
  };
  handleOnChangeText = (event, id) => {
    let copyText = { ...this.state };

    copyText[id] = event.target.value;
    this.setState({
      ...copyText,
    });
  };
  buildDataInputSelect = (inputData, type) => {
    let result = [];
    let { language } = this.props;
    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        if (type === "USERS") {
          let object = {};
          let labelVi = `${item.lastName} ${item.firstName}`;
          let labelEn = `${item.firstName} ${item.lastName}`;
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.id;
          result.push(object);
        }
        if (type === "PRICE") {
          let object = {};
          let labelVi = `${item.valueVi} VND`;
          let labelEn = `${item.valueEn} USD`;
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.keyMap;
          result.push(object);
        }

        if (type === "PAYMENT" || type === "PROVINCE") {
          let object = {};
          let labelVi = `${item.valueVi}`;
          let labelEn = `${item.valueEn}`;
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.keyMap;
          result.push(object);
        }
      });
      if (type === "SPECIALTY") {
        inputData.map((item, index) => {
          let object = {};
          object.label = item.name;
          object.value = item.id;
          result.push(object);
        });
      }
      if (type === "CLINIC") {
        inputData.map((item, index) => {
          let object = {};
          object.label = item.name;
          object.value = item.id;
          result.push(object);
        });
      }
    }
    return result;
  };
  componentDidMount() {
    this.props.fetchAllDoctors();
    this.props.getAllRequiredDoctorInfor();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(
        this.props.allDoctors,
        "USERS"
      );
      this.setState({
        listDoctors: dataSelect,
      });
    }
    if (prevProps.language !== this.props.language) {
      let dataSelect = this.buildDataInputSelect(
        this.props.allDoctors,
        "USERS"
      );
      let { resPayment, resPrice, resProvince, resSpecialty } =
        this.props.allRequiredDoctorInfor;
      let listresPayment = this.buildDataInputSelect(resPayment, "PAYMENT");
      let listresPrice = this.buildDataInputSelect(resPrice, "PRICE");
      let listresProvince = this.buildDataInputSelect(resProvince, "PROVINCE");

      this.setState({
        listDoctors: dataSelect,
        listPayment: listresPayment,
        listPrice: listresPrice,
        listProvince: listresProvince,
      });
    }
    if (
      prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor
    ) {
      let { resPayment, resPrice, resProvince, resSpecialty, resClinic } =
        this.props.allRequiredDoctorInfor;
      let listresPayment = this.buildDataInputSelect(resPayment, "PAYMENT");
      let listresPrice = this.buildDataInputSelect(resPrice, "PRICE");
      let listresProvince = this.buildDataInputSelect(resProvince, "PROVINCE");
      let listresSpecialty = this.buildDataInputSelect(
        resSpecialty,
        "SPECIALTY"
      );
      let listresClinic = this.buildDataInputSelect(resClinic, "CLINIC");
      this.setState({
        listPayment: listresPayment,
        listPrice: listresPrice,
        listProvince: listresProvince,
        listSpecialty: listresSpecialty,
        listClinic: listresClinic,
      });
    }
  }

  render() {
    let {
      selectedOption,
      listPrice,
      listPayment,
      listProvince,
      listSpecialty,
    } = this.state;

    return (
      <div className="manage-doctor-container">
        <div className="manage-doctor-title"> Tao them thong tin doctor</div>
        <div className="more-infor">
          <div className="content-left form-group">
            <FormattedMessage id="manage-doctor.chosse-doctor" />
            <label> </label>
            <Select
              placeholder={
                <FormattedMessage id="manage-doctor.chosse-doctor" />
              }
              value={selectedOption}
              onChange={this.handleChangeSelect}
              options={this.state.listDoctors}
            />
          </div>
          <div className="content-right">
            <label>
              {" "}
              <FormattedMessage id="manage-doctor.input-infomation" />
            </label>
            <textarea
              className="form-control"
              rows="4"
              onChange={(event) =>
                this.handleOnChangeText(event, "description")
              }
              value={this.state.description}
            ></textarea>
          </div>
        </div>
        <div className="more-infor-extra row ">
          <div className="col-4 form-group">
            {/* GIÁ  */}
            <label>
              <FormattedMessage id="manage-doctor.chosse-price" />
            </label>
            <Select
              placeholder={<FormattedMessage id="manage-doctor.chosse-price" />}
              value={this.state.selectedPrice}
              onChange={this.handleChangeSelectDoctorInfor}
              name="selectedPrice"
              options={listPrice}
            />
          </div>

          <div className="col-4 form-group">
            {/* PHƯƠNG THỨC THANH TOÁN */}
            <label>
              {" "}
              <FormattedMessage id="manage-doctor.chosse-payment" />
            </label>
            <Select
              placeholder={
                <FormattedMessage id="manage-doctor.chosse-payment" />
              }
              value={this.state.selectedPayment}
              onChange={this.handleChangeSelectDoctorInfor}
              name="selectedPayment"
              options={listPayment}
            />
          </div>

          <div className="col-4 form-group">
            {/* Đia chi */}
            <label>
              {" "}
              <FormattedMessage id="manage-doctor.chosse-province" />
            </label>
            <Select
              placeholder={
                <FormattedMessage id="manage-doctor.chosse-province" />
              }
              value={this.state.selectedProvince}
              onChange={this.handleChangeSelectDoctorInfor}
              name="selectedProvince"
              options={listProvince}
            />
          </div>

          {/* **** */}
          <div className="col-4 form-group">
            <label>
              {" "}
              <FormattedMessage id="manage-doctor.name-clicin" />
            </label>
            <input
              className="form-control"
              onChange={(event) => this.handleOnChangeText(event, "nameClinic")}
              value={this.state.nameClinic}
            />
          </div>

          <div className="col-4 form-group">
            <label>
              {" "}
              <FormattedMessage id="manage-doctor.clinic-address" />
            </label>
            <input
              className="form-control"
              onChange={(event) =>
                this.handleOnChangeText(event, "addressClinic")
              }
              value={this.state.addressClinic}
            />
          </div>

          <div className="col-4 form-group">
            <label>
              {" "}
              <FormattedMessage id="manage-doctor.note" />
            </label>
            <input
              className="form-control"
              onChange={(event) => this.handleOnChangeText(event, "note")}
              value={this.state.note}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-4 form-group">
            <label> Chọn chuyên khoa </label>
            <Select
              // placeholder={
              //   <FormattedMessage id="manage-doctor.chosse-province" />
              // }
              value={this.state.selectedSpecialty}
              onChange={this.handleChangeSelectDoctorInfor}
              name="selectedSpecialty"
              options={listSpecialty}
            />
          </div>
          <div className="col-4 form-group">
            <label> Chọn phòng khám </label>
            <Select
              // placeholder={
              //   <FormattedMessage id="manage-doctor.chosse-province" />
              // }
              value={this.state.selectedClinic}
              onChange={this.handleChangeSelectDoctorInfor}
              name="selectedClinic"
              options={this.state.listClinic}
            />
          </div>
        </div>
        <div className="manage-doctor-editor">
          <MdEditor
            style={{ height: "500px", width: "100%" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={this.handleEditorChange}
            value={this.state.contentMarkdown}
          />
        </div>

        <button
          className="save-content-doctor btn btn-success"
          onClick={() => this.handleSaveContentMarkdown()}
        >
          {this.state.hasOldData === false ? "Lưu thông tin" : "Sửa thông tin "}
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allDoctors: state.admin.allDoctors,
    language: state.app.language,
    allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
    getAllRequiredDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
