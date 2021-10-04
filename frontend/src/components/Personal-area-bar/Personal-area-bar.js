import React from "react";
import "./Personal-area-bar.css";
import { connect } from "react-redux";
import { removeUser } from "../../redux/user";
import { removeRestaurant } from "../../redux/restaurant";
import { unSetIsRestaurantLoggedIn } from "../../redux/restaurantLogin";
import { unSetIsUserLoggedIn } from "../../redux/userLogin";
import { useHistory } from "react-router-dom";
import { BACKEND_HOST, BACKEND_PORT } from "../../config";

function PersonalAreaBar(props) {
  const cartImage = `http://${BACKEND_HOST}:${BACKEND_PORT}/images/cart.png`;
  const history = useHistory();

  const handleClick = e => {
    e.preventDefault();
    if (props.isUserLoggedIn) {
      props.removeUser();
      props.unSetIsUserLoggedIn();
      localStorage.removeItem("user");
      localStorage.removeItem("isUserLoggedIn");
    } else {
      props.removeRestaurant();
      props.unSetIsRestaurantLoggedIn();
      localStorage.removeItem("restaurant");
      localStorage.removeItem("isRestaurantLoggedIn");
    }
    history.push("/");
  };
  return (
    <div className="Personal-area-bar">
      {/*<button className="Personal-area-bar__sign-in">Sign in</button>*/}
      {props.isUserLoggedIn && (
        <button
          className="Personal-area-bar__basket"
          onClick={() => {
            props.open(true);
          }}
        >
          <img
            src={cartImage}
            alt="basket"
            className="Personal-area-bar__basket-image"
          />
          <span className="Personal-area-bar__basket-text">Cart</span>
        </button>
      )}
      {(props.isRestaurantLoggedIn || props.isUserLoggedIn) && (
        <div className="Personal-area-bar__register--wrapper">
          <button onClick={handleClick} className="Personal-area-bar__register">
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

function mapStateToProps(globalState) {
  return {
    isUserLoggedIn: globalState.isUserLoggedIn,
    isRestaurantLoggedIn: globalState.isRestaurantLoggedIn
  };
}

function mapDispatchToProps(dispatch) {
  return {
    removeUser: () => dispatch(removeUser()),
    unSetIsUserLoggedIn: () => dispatch(unSetIsUserLoggedIn()),
    removeRestaurant: () => dispatch(removeRestaurant()),
    unSetIsRestaurantLoggedIn: () => dispatch(unSetIsRestaurantLoggedIn())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonalAreaBar);
