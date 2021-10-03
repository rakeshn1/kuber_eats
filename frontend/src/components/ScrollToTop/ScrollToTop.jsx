import React from "react";
import { withRouter } from "react-router-dom";

class ScrollToTop extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      document.querySelector("html").style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      setTimeout(function() {
        document.querySelector("html").style.scrollBehavior = "smooth";
      }, 0);
    }
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(ScrollToTop);
