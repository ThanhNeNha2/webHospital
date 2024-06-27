import React, { Component } from "react";
import { connect } from "react-redux";
import "./DoctorExtraInfor.scss";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import { getExtraInforDoctorById } from "../../../services/userService";
import NumberFormat from "react-number-format";
class DoctorExtraInfor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCheck: true,
      extraInfor: {},
    };
  }
  handleShowHide = () => {
    this.setState({
      isCheck: !this.state.isCheck,
    });
  };
  async componentDidMount() {
    let data = await getExtraInforDoctorById(this.props.doctorIdFromParent);
    if (data && data.data) {
      this.setState({
        extraInfor: data.data,
      });
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
      let data = await getExtraInforDoctorById(this.props.doctorIdFromParent);
      if (data && data.data) {
        this.setState({
          extraInfor: data.data,
        });
      }
    }
  }
  render() {
    let { extraInfor } = this.state;

    return (
      <div className="doctor-extra-infor-container">
        <div className="content-up">
          <div className="content-up-threads">
            {" "}
            <FormattedMessage id="doctorextrainfor.examination-address" />{" "}
          </div>
          <div className="content-up-contentUP">
            {" "}
            {extraInfor && extraInfor.nameClinic ? extraInfor.nameClinic : ""}
          </div>
          <div className="content-up-contentDOWN">
            {extraInfor && extraInfor.addressClinic
              ? extraInfor.addressClinic
              : ""}
          </div>
        </div>
        <div className="content-down">
          {this.state.isCheck === true ? (
            <div>
              <FormattedMessage id="doctorextrainfor.examination-price" />{" "}
              <NumberFormat
                value={
                  extraInfor && extraInfor.priceTypeData
                    ? this.props.language === LANGUAGES.VI
                      ? extraInfor.priceTypeData.valueVi
                      : extraInfor.priceTypeData.valueEn
                    : ""
                }
                displayType={"text"}
                thousandSeparator={true}
                suffix={
                  this.props.language === LANGUAGES.VI ? " VNĐ " : " USD "
                }
              />
              <a
                href="#"
                onClick={() => {
                  this.handleShowHide();
                }}
              >
                {" "}
                <FormattedMessage id="doctorextrainfor.details" />{" "}
              </a>
            </div>
          ) : (
            <>
              {" "}
              <div className="box-hide">
                <div>
                  {" "}
                  <FormattedMessage id="doctorextrainfor.examination-price" />{" "}
                </div>
                <div>
                  <FormattedMessage id="doctorextrainfor.examination-price" />{" "}
                  <NumberFormat
                    value={
                      extraInfor && extraInfor.priceTypeData
                        ? this.props.language === LANGUAGES.VI
                          ? extraInfor.priceTypeData.valueVi
                          : extraInfor.priceTypeData.valueEn
                        : ""
                    }
                    displayType={"text"}
                    thousandSeparator={true}
                    suffix={
                      this.props.language === LANGUAGES.VI ? " VNĐ " : " USD "
                    }
                  />
                </div>
                <div>
                  {" "}
                  {extraInfor && extraInfor.note ? extraInfor.note : ""}
                </div>
              </div>
              <div>
                <FormattedMessage id="doctorextrainfor.payment" />{" "}
                {extraInfor && extraInfor.paymentTypeData
                  ? this.props.language === LANGUAGES.VI
                    ? extraInfor.paymentTypeData.valueVi
                    : extraInfor.paymentTypeData.valueEn
                  : ""}
              </div>
              <div>
                {" "}
                <a
                  href="#"
                  onClick={() => {
                    this.handleShowHide();
                  }}
                >
                  <FormattedMessage id="doctorextrainfor.hide" />{" "}
                </a>{" "}
              </div>
            </>
          )}
        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
