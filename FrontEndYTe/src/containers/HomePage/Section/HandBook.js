import React, { Component } from "react";
import { connect } from "react-redux";

import { FormattedMessage } from "react-intl";
// Import css files
import Slider from "react-slick";

class HandBook extends Component {
  render() {
    return (
      <div className="section-share section-handbook">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">Cơ sở ý tế nổi bật </span>
            <button className="btn-section"> Xem thêm </button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              <div className="section-customize">
                <div className="bg-image section-handbook" />
                <div> Hệ thống Y tế Thu Cúc 1</div>
              </div>

              <div className="section-customize">
                <div className="bg-image section-handbook" />
                <div> Hệ thống Y tế Thu Cúc 2</div>
              </div>

              <div className="section-customize">
                <div className="bg-image section-handbook" />
                <div> Hệ thống Y tế Thu Cúc 3</div>
              </div>

              <div className="section-customize">
                <div className="bg-image section-handbook" />
                <div> Hệ thống Y tế Thu Cúc 4</div>
              </div>

              <div className="section-customize">
                <div className="bg-image section-handbook" />
                <div> Hệ thống Y tế Thu Cúc 5</div>
              </div>

              <div className="section-customize">
                <div className="bg-image section-handbook" />
                <div> Hệ thống Y tế Thu Cúc 6</div>
              </div>
            </Slider>
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(HandBook);
