import React from "react";
import "./UserSignUp.css";
import { Link, useHistory } from "react-router-dom";
import Swal from "sweetalert2";
const axios = require("axios");

export default function RestaurantSignUp(props) {
  const history = useHistory();
  async function handleClick(event) {
    try {
      event.preventDefault();
      const response = await axios({
        method: "post",
        url: "http://localhost:5676/restaurants/create",
        data: {
          title: event.target.restaurantName.value,
          email: event.target.email.value,
          location: event.target.location.value,
          password: event.target.password.value
        }
      });
      if (response.status == 200) {
        Swal.fire(
          "Sign up successful!",
          "Your restaurant has been added",
          "success"
        );
        history.push("/restaurantLogin");
      } else {
        throw new Error(response.data.msg);
      }
    } catch (e) {
      console.log(e);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error:" + e
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
                Restaurant Sign Up
              </span>
              <div
                className="wrap-input100 validate-input m-t-85 m-b-35"
                validate="Enter Restaurant Name"
              >
                <input
                  className="input100"
                  type="text"
                  name="restaurantName"
                  placeholder="Restaurant Name"
                />
                <span
                  className="focus-input100"
                  placeholder="Restaurant Name"
                ></span>
              </div>
              <div
                className="wrap-input100 validate-input m-t-85 m-b-35"
                validate="Enter Email ID"
              >
                <input
                  className="input100"
                  type="email"
                  name="email"
                  placeholder="Email ID"
                />
                <span className="focus-input100" placeholder="Username"></span>
              </div>
              <div
                className="wrap-input100 validate-input m-t-85 m-b-35"
                validate="Enter Location"
              >
                <input
                  className="input100"
                  type="text"
                  name="location"
                  placeholder="Location"
                />
                <span className="focus-input100" placeholder="Location"></span>
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

              <div
                className="wrap-input100 validate-input m-b-50"
                validate="Enter password"
              >
                <input
                  className="input100"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                />
                <span className="focus-input100" placeholder="Password"></span>
              </div>

              <br />
              <br />
              <div className="container-login100-form-btn">
                <button className="login100-form-btn">Sign Up</button>
              </div>
              <br />
              <br />
              <br />
              <ul className="login-more p-t-190">
                <Link to={"/restaurantLogin"}>
                  <li className="m-b-8">
                    <p className="txt2">Restaurant Login</p>
                  </li>
                </Link>
              </ul>
              <br />
              <ul className="login-more p-t-190">
                <Link to={"/userSignup"}>
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
