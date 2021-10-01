import React from "react";
import "./Header.css";
import { OrderDelivery } from "../Order-delivery/Order-delivery.jsx";
import PersonalAreaBar from "../Personal-area-bar/Personal-area-bar";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Container } from "../../Container/Container";
import NavigationBar from "../NavigationBar/NavigationBar";
import { BACKEND_HOST, BACKEND_PORT } from "../../config";

function Header(props) {
  const uberImage = `http://${BACKEND_HOST}:${BACKEND_PORT}/images/uber.svg`;
  return (
    <header className="Header">
      {/*<Container>*/}
      <div className="Header__wrapper">
        <div className="Header__logo-wrapper">
          {(props.isUserLoggedIn || props.isRestaurantLoggedIn) && (
            <NavigationBar />
          )}
          {props.isUserLoggedIn && (
            <Link className="Header__logo" to={"/"}></Link>
          )}
          {!props.isUserLoggedIn && (
            <Link to={"/"}>
              <img src={uberImage} alt="Logo" className="Header__logo-image" />
            </Link>
          )}
        </div>
        <>
          {/*<div className={"Header__order-delivery"}>*/}
          {/*  <OrderDelivery />*/}
          {/*</div>*/}
          <PersonalAreaBar open={props.open} />
        </>
      </div>
      {/*</Container>*/}
    </header>
  );
}

function mapStateToProps(globalState) {
  return {
    isUserLoggedIn: globalState.isUserLoggedIn,
    isRestaurantLoggedIn: globalState.isRestaurantLoggedIn
  };
}

export default connect(
  mapStateToProps,
  null
)(Header);
