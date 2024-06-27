import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import "./Login.scss";
import { FormattedMessage } from "react-intl";
import { handleLoginApi } from "../../services/userService";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      isShowPassword: true,
      errMessage: "",
    };
  }
  handleOnChangeUsername = (e) => {
    this.setState({
      username: e.target.value,
    });
  };
  handleOnChangePassword = (e) => {
    this.setState({
      password: e.target.value,
    });
  };
  handleLogin = async () => {
    this.setState({
      errMessage: "",
    });
    try {
      let data = await handleLoginApi(this.state.username, this.state.password);
      if (data && data.errCode !== 0) {
        this.setState({
          errMessage: data.message,
        });
      }
      if (data && data.errCode === 0) {
        this.props.userLoginSuccess(data.user);
      }
    } catch (e) {
      if (e.response) {
        this.setState({
          errMessage: e.response.data.message,
        });
      }
    }
  };
  handleShowHidePassword = () => {
    this.setState({ isShowPassword: !this.state.isShowPassword });
  };
  submitKey = (e) => {
    if (e.key === "Enter") {
      this.handleLogin();
    }
  };
  render() {
    return (
      <>
        <div className="login-background">
          <div className="login-container">
            <div className="login-content row">
              <div className="col-12 text-center text-login"> Login </div>
              <div className="col-12 form-group login-input ">
                {" "}
                <label>Username :</label>
                <input
                  type="text"
                  className="form-control "
                  value={this.state.username}
                  onChange={(e) => {
                    this.handleOnChangeUsername(e);
                  }}
                />
              </div>
              <div className="col-12 form-group login-input ">
                {" "}
                <label>Password :</label>
                <input
                  type={this.state.isShowPassword == true ? "password" : "text"}
                  className="form-control iconpassword "
                  value={this.state.password}
                  onChange={(e) => {
                    this.handleOnChangePassword(e);
                  }}
                  onKeyPress={(e) => {
                    this.submitKey(e);
                  }}
                />
                <div
                  className="iconeye"
                  onClick={() => {
                    this.handleShowHidePassword();
                  }}
                >
                  {this.state.isShowPassword == true ? (
                    <i className="far fa-eye"></i>
                  ) : (
                    <i className="far fa-eye-slash"></i>
                  )}
                </div>
              </div>
              <div className="col-12" style={{ color: "red" }}>
                {this.state.errMessage}
              </div>
              <div className="col-12 ">
                <button
                  className=" btn-login"
                  onClick={() => {
                    this.handleLogin();
                  }}
                >
                  Login
                </button>
              </div>
              <div className="col-12">
                {" "}
                <span> Forgot your passwords ?</span>
              </div>
              <div className="col-12 icons-login">
                {" "}
                <span>
                  {" "}
                  <i className="fab fa-google-plus-g"></i>
                  <i className="fab fa-facebook-square"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
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
  return {
    navigate: (path) => dispatch(push(path)),

    // userLoginFail: () => dispatch(actions.adminLoginFail()),
    userLoginSuccess: (userInfo) =>
      dispatch(actions.userLoginSuccess(userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
