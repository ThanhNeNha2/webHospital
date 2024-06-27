import React, { Component } from "react";
import { connect } from "react-redux";
import "./ProfileDoctor.scss";
import { FormattedMessage } from "react-intl";
import { getProfileDoctorById } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import NumberFormat from "react-number-format";
import _ from "lodash";
import moment from "moment";
import { Link } from "react-router-dom";
class ProfileDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataProfile: {},
    };
  }

  async componentDidMount() {
    let data = await this.getInforDoctor(this.props.doctorId);
    this.setState({
      dataProfile: data,
    });
  }

  getInforDoctor = async (id) => {
    let result = {};
    if (id) {
      let data = await getProfileDoctorById(id);
      if (data && data.errCode === 0) {
        result = data.data;
      }
    }
    return result;
  };
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
      let data = await this.getInforDoctor(this.props.doctorId);
      this.setState({
        dataProfile: data,
      });
    }
    if (this.props.doctorId !== prevProps.doctorId) {
      this.getInforDoctor(this.props.doctorId);
    }
  }

  renderTimeBooking = (dataTime) => {
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
      return (
        <>
          <div style={{ textTransform: "capitalize" }}>
            {time} - {date}
          </div>
          <div> Miễn phí đặt lịch </div>
        </>
      );
    } else return <></>;
  };
  render() {
    let { dataProfile } = this.state;
    let { language, isShowDescriptionDoctor, dataTime, doctorId } = this.props;
    console.log("check kĩ kĩ ", doctorId);
    let nameVi = "";
    let nameEn = "";
    if (dataProfile && dataProfile.positionData) {
      nameVi = `${dataProfile.positionData.valueVi}, ${
        dataProfile.lastName + " " + dataProfile.firstName
      }`;
      nameEn = `${dataProfile.positionData.valueEn}, ${
        dataProfile.firstName + " " + dataProfile.lastName
      }`;
    }

    return (
      <>
        <div className="intro-doctor">
          <div
            className="content-left"
            style={{
              backgroundImage: `url(${
                dataProfile.image ? dataProfile.image : ""
              })`,
            }}
          ></div>
          <div className="content-right">
            <div className="up">
              {" "}
              {language === LANGUAGES.VI ? nameVi : nameEn}
            </div>
            <div className="down">
              {" "}
              {isShowDescriptionDoctor === true ? (
                dataProfile &&
                dataProfile.Markdown &&
                dataProfile.Markdown.description && (
                  <span> {dataProfile.Markdown.description} </span>
                )
              ) : (
                <>{this.renderTimeBooking(dataTime)}</>
              )}
            </div>
          </div>
        </div>

        {this.props.isShowLinkDetail === true && (
          <div className="detail">
            <Link to={`/detail-doctor/${doctorId}`}> Xem chi tiết</Link>
          </div>
        )}

        {this.props.isShowPrice === true && (
          <div className="price mt-3">
            {" "}
            Giá Khám:{" "}
            <NumberFormat
              value={
                dataProfile && dataProfile.Doctor_Infor
                  ? this.props.language === LANGUAGES.VI
                    ? dataProfile.Doctor_Infor.priceTypeData.valueVi
                    : dataProfile.Doctor_Infor.priceTypeData.valueEn
                  : ""
              }
              displayType={"text"}
              thousandSeparator={true}
              suffix={this.props.language === LANGUAGES.VI ? " VNĐ " : " USD "}
            />
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
