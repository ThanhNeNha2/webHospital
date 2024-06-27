import React, { Component } from "react";
import { connect } from "react-redux";

import { FormattedMessage } from "react-intl";

class HomeFooter extends Component {
  render() {
    return (
      <div className="home-footer">
        <p>
          {" "}
          &copy; 2021 Võ Chí Thanh More information , please visit my youtube
          channel !{" "}
          <a target="_blank" href="#">
            {" "}
            Click here{" "}
          </a>
        </p>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    lang: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
