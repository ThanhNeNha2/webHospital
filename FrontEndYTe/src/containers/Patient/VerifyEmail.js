import React, { Component } from "react";
import { connect } from "react-redux";
import "./VerifyEmail.scss";
import { FormattedMessage } from "react-intl";
import { postVerifyBookAppointment } from "../../services/userService";
import HomeHeader from "../HomePage/HomeHeader";
class VerifyEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusVerify: false,
      errCode: "",
    };
  }

  async componentDidMount() {
    if (this.props.location && this.props.location.search) {
      let urlParams = new URLSearchParams(this.props.location.search);
      let token = urlParams.get("token");
      let doctorId = urlParams.get("doctorId");
      let res = await postVerifyBookAppointment({
        token: token,
        doctorId: doctorId,
      });
      if (res && res.errCode === 0) {
        this.setState({
          statusVerify: true,
          errCode: 0,
        });
      } else {
        this.setState({
          statusVerify: true,
          errCode: 1,
        });
      }
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {}
  render() {
    let { statusVerify, errCode } = this.state;
    return (
      <div>
        <HomeHeader />
        {statusVerify === false ? (
          <div className="verify-email">Loading ....</div>
        ) : +errCode === 0 ? (
          <div className="verify-email"> Xác nhận đặt lịch thành công! </div>
        ) : (
          <div className="verify-email">
            {" "}
            Lịch hẹn đã được xác nhận hoặc không tồn tại!
          </div>
        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
