import React from "react";
import "./login.css";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { setRestaurant } from "../../redux/restaurant";
import { setIsRestaurantLoggedIn } from "../../redux/restaurantLogin";
import { BACKEND_HOST, BACKEND_PORT } from "../../config";
import axios from "axios";
import Swal from "sweetalert2";

function RestaurantLogin(props) {
  const history = useHistory();
  async function handleClick(event) {
    try {
      event.preventDefault();
      const response = await axios({
        method: "post",
        url: `http://${BACKEND_HOST}:${BACKEND_PORT}/restaurants/login`,
        data: {
          email: event.target.email.value,
          password: event.target.password.value
        }
      });
      if (response.status == 200) {
        localStorage.setItem("restaurant", JSON.stringify(response.data));
        localStorage.setItem("isRestaurantLoggedIn", true);
        props.setIsRestaurantLoggedIn();
        props.setRestaurant(response.data);
        history.push("/restaurantDashBoard");
      } else {
        throw new Error("Username/Password is invalid");
      }
    } catch (e) {
      console.log(e);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: e
      });
    }
  }
  return (
    <>
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100 p-t-85 p-b-20">
            <form
              className="login100-form validate-form"
              onSubmit={handleClick}
            >
              <span className="login100-form-title p-b-70">
                Restaurant login
              </span>
              <div
                className="wrap-input100 validate-input m-t-85 m-b-35"
                validate="Enter email"
              >
                <input
                  className="input100"
                  type="text"
                  name="email"
                  placeholder="Email"
                />
                <span className="focus-input100" placeholder="Email"></span>
              </div>

              <div
                className="wrap-input100 validate-input m-b-50"
                validate="Enter password"
              >
                <input
                  className="input100"
                  type="password"
                  name="password"
                  placeholder="Password"
                />
                <span className="focus-input100" placeholder="Password"></span>
              </div>
              <br />
              <br />
              <div className="container-login100-form-btn">
                <button className="login100-form-btn">Login</button>
              </div>
              <br />
              <br />
              <br />
              <ul className="login-more p-t-190">
                <Link to={"/restaurantSignup"}>
                  <li className="m-b-8">
                    <p className="txt2">
                      Don't have a restaurant account? Sign up here
                    </p>
                  </li>
                </Link>
              </ul>
              <br />
              <ul className="login-more p-t-190">
                <Link to={"/userSignUp"}>
                  <li className="m-b-8">
                    {/*<p className="txt1">*/}
                    {/*	Forgot*/}
                    {/*</p>*/}
                    <p className="txt2">User Sign up</p>
                  </li>
                </Link>
                <Link to={"/"}>
                  <li>
                    {/*<p className="txt1">*/}
                    {/*	Don’t have an account?*/}
                    {/*</p>*/}

                    <p className="txt2">User Login</p>
                  </li>
                </Link>
              </ul>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    setRestaurant: restaurantData => dispatch(setRestaurant(restaurantData)),
    setIsRestaurantLoggedIn: () => dispatch(setIsRestaurantLoggedIn())
  };
}

export default connect(
  null,
  mapDispatchToProps
)(RestaurantLogin);
