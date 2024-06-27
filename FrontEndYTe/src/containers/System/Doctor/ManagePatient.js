import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManagePatient.scss";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import DatePicker from "../../../components/Input/DatePicker";
import { getAllPatientForDoctor } from "../../../services/userService";
import moment from "moment";

class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(new Date()).startOf("day").valueOf(),
      dataPatient: [],
    };
  }
  handleOnchangeDatePicker = (date) => {
    this.setState(
      {
        currentDate: date[0],
      },
      () => {
        let { user } = this.props;
        let { currentDate } = this.state;
        let formatedDate = new Date(currentDate).getTime();
        this.getDataPatient(user, formatedDate);
      }
    );
  };
  async componentDidMount() {
    let { user } = this.props;
    let { currentDate } = this.state;
    let formatedDate = new Date(currentDate).getTime();
    this.getDataPatient(user, formatedDate);
  }

  getDataPatient = async (user, formatedDate) => {
    let res = await getAllPatientForDoctor({
      doctorId: user.id,
      date: formatedDate,
    });
    if (res && res.errCode === 0) {
      this.setState({
        dataPatient: res.data,
      });
    }
  };
  handleBtnConfirm = () => {
    alert("hihiih");
  };
  async componentDidUpdate(prevProps, prevState, snapshot) {}
  render() {
    let { dataPatient } = this.state;
    return (
      <div className="manage-patient-container container">
        <div className="m-p-title">Quản lý bệnh nhân khám bệnh</div>
        <div className="manage-patient-body row">
          <div className="col-6 form-group">
            <label>Chọn ngày khám</label>
            <DatePicker
              onChange={this.handleOnchangeDatePicker}
              className="form-control"
              value={this.state.currentDate}
            />
          </div>
          <div className="col-12 table-manage-patient">
            <table className="" style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <th>STT</th>
                  <th>Thời gian </th>
                  <th>Họ và tên </th>
                  <th>Giới tính </th>
                  <th>Actions</th>
                </tr>
                {dataPatient && dataPatient.length > 0 ? (
                  dataPatient.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          {this.props.language === LANGUAGES.VI
                            ? item.timeTypeDataPatient.valueVi
                            : item.timeTypeDataPatient.valueEn}
                        </td>

                        <td>{item.patientData.firstName}</td>
                        <td>
                          {this.props.language === LANGUAGES.VI
                            ? item.patientData.genderData.valueVi
                            : item.patientData.genderData.valueEn}
                        </td>
                        <td>
                          {" "}
                          <button
                            className="btn btn-success"
                            onClick={() => {
                              this.handleBtnConfirm(item);
                            }}
                          >
                            Xác nhận{" "}
                          </button>{" "}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <>
                    <div>Không có lịch </div>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,

    user: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
