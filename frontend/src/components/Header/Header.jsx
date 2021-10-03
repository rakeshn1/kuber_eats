import React, { useState } from "react";
import "./Header.css";
import { OrderDelivery } from "../Order-delivery/Order-delivery.jsx";
import PersonalAreaBar from "../Personal-area-bar/Personal-area-bar";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Container } from "../../Container/Container";
import NavigationBar from "../NavigationBar/NavigationBar";
import DietryOptions from "./DietryOptions";
import { BACKEND_HOST, BACKEND_PORT } from "../../config";
import { setDeliveryType } from "../../redux/deliveryType";
import { setLocation } from "../../redux/location";
import group from "./image/Group.svg";
import downArrow from "./image/downArrow.svg";

function Header(props) {
  const uberImage = `http://${BACKEND_HOST}:${BACKEND_PORT}/images/uber.svg`;
  const [delivery, setDelivery] = useState("Delivery_button_d_s");
  const [pickUP, setPickUp] = useState("Delivery_button_p");
  const [open, setOpen] = useState(false);

  const handleDelivery = e => {
    e.preventDefault();
    if (delivery !== "Delivery_button_d_s") {
      setDelivery(() => "Delivery_button_d_s");
      setPickUp(() => "Delivery_button_p");
      props.setDeliveryType("delivery");
    }
  };

  const handlePickUp = e => {
    e.preventDefault();
    if (pickUP !== "Delivery_button_p_s") {
      setPickUp(() => "Delivery_button_p_s");
      setDelivery(() => "Delivery_button_d");
      props.setDeliveryType("pickUp");
    }
  };

  const onInputHandler = event => {
    props.setLocation(event.target.value);
  };

  const setOpenOptions = () => {
    setOpen(prevState => {
      return !prevState;
    });
  };

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
          {props.isUserLoggedIn && (
            <div className="Delivery_button_container">
              <span className={delivery} onClick={handleDelivery}>
                Delivery
              </span>
              <span className={pickUP} onClick={handlePickUp}>
                Pickup
              </span>
            </div>
          )}
        </div>
        <>
          {props.isUserLoggedIn && (
            <>
              <div className={"Header__order-delivery"}>
                <img
                  src={group}
                  alt=""
                  className="HOrder-delivery__location-arrow"
                />
                <input
                  type="text"
                  placeholder="Your location"
                  className="HOrder-delivery__location-enter"
                  onInput={onInputHandler}
                />
              </div>
              <div className="Dietry_button_container" onClick={setOpenOptions}>
                <span className="Dietry_button_d">Dietary</span>
                <img
                  src={downArrow}
                  alt="downArrow"
                  className="Dietry_downArrow"
                />
              </div>
              {open && <DietryOptions setOptions={setOpenOptions} />}
            </>
          )}
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
    isRestaurantLoggedIn: globalState.isRestaurantLoggedIn,
    location: globalState.location
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setDeliveryType: deliveryType => dispatch(setDeliveryType(deliveryType)),
    setLocation: location => dispatch(setLocation(location))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
