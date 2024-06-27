import React, { Component } from "react";
import { connect } from "react-redux";
import "./BookingModal.scss";
import { FormattedMessage } from "react-intl";
import { Modal } from "reactstrap";
import ProfileDoctor from "../ProfileDoctor";
import _ from "lodash";
import DatePicker from "../../../../components/Input/DatePicker";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import Select from "react-select";
import { postPatientBookAppoint } from "../../../../services/userService";
import { toast } from "react-toastify";
import moment from "moment";

class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
      reason: "",
      birthday: new Date(),
      genders: "",
      doctorId: "",
      selectedGender: "",
      timeType: "",
    };
  }
  handleOnchangeInput = (event, id) => {
    let valueInput = event.target.value;
    let stateCopy = { ...this.state };
    stateCopy[id] = valueInput;
    this.setState({
      ...stateCopy,
    });
  };
  handleOnchangeDatePicker = (date) => {
    this.setState({
      birthday: date[0],
    });
  };
  componentDidMount() {
    this.props.getGenders();
  }
  buildDataGender = (data) => {
    let result = [];
    let language = this.props.language;

    if (data && data.length > 0) {
      data.map((item) => {
        let object = {};
        object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
        object.value = item.keyMap;
        result.push(object);
      });
    }
    return result;
  };
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
      this.setState({
        genders: this.buildDataGender(this.props.genders),
      });
    }
    if (this.props.genders !== prevProps.genders) {
      this.setState({
        genders: this.buildDataGender(this.props.genders),
      });
    }
    if (this.props.dataTime !== prevProps.dataTime) {
      if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
        let doctorId = this.props.dataTime.doctorId;
        let timeType = this.props.dataTime.timeType;
        this.setState({
          doctorId: doctorId,
          timeType: timeType,
        });
      }
    }
  }
  handleChangeSelect = (selectedOption) => {
    this.setState({
      selectedGender: selectedOption,
    });
  };
  buildTimeBooking = (dataTime) => {
    let { language } = this.props;
    if (dataTime && !_.isEmpty(dataTime)) {
      let time =
        language === LANGUAGES.VI
          ? dataTime.timeTypeData.valueVi
          : dataTime.timeTypeData.valueEn;
      let date =
        language === LANGUAGES.VI
          ? moment.unix(+dataTime.date / 1000).format("dddd - DD/MM/YYYY")
          : moment
              .unix(+dataTime.date / 1000)
              .locale("en")
              .format("ddd - MM/DD/YYYY");
      return `${time} ${date}`;
    } else return "";
  };

  buildDoctorName = (dataTime) => {
    let { language } = this.props;
    if (dataTime && !_.isEmpty(dataTime)) {
      let name =
        language === LANGUAGES.VI
          ? `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
          : `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`;
      return name;
    } else return "";
  };
  handleConfirmBooking = async () => {
    let timeString = this.buildTimeBooking(this.props.dataTime);
    let doctorName = this.buildDoctorName(this.props.dataTime);

    console.log("check state", this.state);
    let date = new Date(this.state.birthday).getTime();
    let res = await postPatientBookAppoint({
      fullName: this.state.fullName,
      phoneNumber: this.state.phoneNumber,
      email: this.state.email,
      address: this.state.address,
      reason: this.state.reason,
      birthday: this.state.birthday,
      date: this.props.dataTime.date,
      birthday: date,
      selectedGender: this.state.selectedGender.value,
      doctorId: this.state.doctorId,
      timeType: this.state.timeType,
      language: this.props.language,
      timeString: timeString,
      doctorName: doctorName,
    });
    if (res && res.errCode === 0) {
      toast.success("Create booking success! ");
      this.props.closeBookingClose();
    } else toast.success("Create booking success! ");
  };

  render() {
    let { isOpenModal, dataTime } = this.props;
    let doctorId = dataTime && !_.isEmpty(dataTime) ? dataTime.doctorId : "";

    return (
      <Modal
        isOpen={isOpenModal}
        className={"booking-modal-container"}
        size="lg"
        centered
      >
        <div className="booking-modal-content">
          <div className="booking-modal-header">
            <span className="left"> Thông tin đặt lịch khám bệnh</span>
            <span className="right">
              {" "}
              <i
                className="fas fa-times"
                onClick={this.props.closeBookingClose}
              ></i>
            </span>
          </div>
          <div className="booking-modal-body container ">
            <div className="doctor-infor ">
              <ProfileDoctor
                doctorId={doctorId}
                isShowDescriptionDoctor={false}
                dataTime={dataTime}
                isShowLinkDetail={false}
                isShowPrice={true}
              />
            </div>

            <div className="row">
              <div className="col-6 form-group">
                <babel> Họ và tên</babel>
                <input
                  className="form-control"
                  value={this.state.fullName}
                  onChange={(event) => {
                    this.handleOnchangeInput(event, "fullName");
                  }}
                />
              </div>{" "}
              <div className="col-6 form-group">
                <babel> Số điện thoại</babel>
                <input
                  className="form-control"
                  value={this.state.phoneNumber}
                  onChange={(event) => {
                    this.handleOnchangeInput(event, "phoneNumber");
                  }}
                />
              </div>{" "}
              <div className="col-6 form-group">
                <babel> Địa chỉ email</babel>
                <input
                  className="form-control"
                  value={this.state.email}
                  onChange={(event) => {
                    this.handleOnchangeInput(event, "email");
                  }}
                />
              </div>{" "}
              <div className="col-6 form-group">
                <babel> Địa chỉ liên hệ</babel>
                <input
                  className="form-control"
                  value={this.state.address}
                  onChange={(event) => {
                    this.handleOnchangeInput(event, "address");
                  }}
                />
              </div>
              <div className="col-12 form-group">
                <babel> Lý do khám</babel>
                <input
                  className="form-control"
                  value={this.state.reason}
                  onChange={(event) => {
                    this.handleOnchangeInput(event, "reason");
                  }}
                />
              </div>{" "}
              <div className="col-6 form-group">
                <babel> Ngày sinh </babel>
                <DatePicker
                  onChange={this.handleOnchangeDatePicker}
                  className="form-control"
                  value={this.state.birthday}
                  minDate={new Date().setHours(0, 0, 0, 0)}
                />
              </div>{" "}
              <div className="col-6 form-group">
                <babel> Giới tính </babel>

                <Select
                  value={this.state.selectedGender}
                  onChange={this.handleChangeSelect}
                  options={this.state.genders}
                />
              </div>
            </div>
          </div>
          <div className="booking-modal-footer">
            <button
              className="btn btn-success mr-3"
              onClick={() => {
                this.handleConfirmBooking();
              }}
            >
              {" "}
              Xác nhận
            </button>
            <button
              className="btn btn-warning"
              onClick={this.props.closeBookingClose}
            >
              {" "}
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genders: state.admin.genders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenders: () => dispatch(actions.fetchGenderStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
