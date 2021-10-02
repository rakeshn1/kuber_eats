import React, { useState } from "react";
import "./UserSignUp.css";
import { Link, useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import { BACKEND_HOST, BACKEND_PORT } from "../../config";
import { removeSignUp, setSignUp } from "../../redux/signUp";
import { connect } from "react-redux";
const axios = require("axios");

function RestaurantSignUp(props) {
  const history = useHistory();

  const initState = {
    email: "",
    password: "",
    confirmPassword: ""
  };
  const [error, setError] = useState(initState);
  const [password, setPassword] = useState("");

  async function handleClick(event) {
    try {
      event.preventDefault();
      if (formValid(error)) {
        const response = await axios({
          method: "post",
          url: `http://${BACKEND_HOST}:${BACKEND_PORT}/restaurants/create`,
          data: {
            title: event.target.restaurantName.value,
            email: event.target.email.value,
            location: event.target.location.value,
            password: event.target.password.value
          }
        });
        if (response.status == 200) {
          await props.setSignUp();
        } else {
          throw new Error(response.data.msg);
        }
      } else {
        Swal.fire({
          title: "Please enter all the values in required format",
          confirmButtonColor: "black"
        });
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

  const formValid = error => {
    const values = Object.values(error);
    for (let i = 0; i < values.length; i++) {
      if (values[i].length > 0) {
        return false;
      }
    }
    return true;
  };

  const formValChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    let newError = { ...error };

    switch (name) {
      case "email":
        newError.email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        )
          ? ""
          : "Enter a valid email address";
        break;
      case "password":
        newError.password = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(
          value
        )
          ? ""
          : "Password should contain at least 8 characters, a number, an upperCase letter and a lower case letter";
        setPassword(() => value);
        break;
      case "confirmPassword":
        newError.confirmPassword =
          password === value ? "" : "Passwords do not match";
      default:
        break;
    }

    setError(() => {
      return newError;
    });
  };

  function callSuccess() {
    Swal.fire(
      `${props.signUpMessage}!`,
      "Your restaurant has been added",
      "success"
    );
    props.removeSignUp();
    history.push("/restaurantLogin");
  }

  return (
    <>
      {props.signUpMessage && <div>{callSuccess()}</div>}
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
                {error.email.length > 0 && (
                  <>
                    {" "}
                    <span className="invalid-feedback">{error.email}</span>
                  </>
                )}
                <input
                  className="input100"
                  type="email"
                  name="email"
                  onChange={formValChange}
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
                {error.password.length > 0 && (
                  <>
                    {" "}
                    <span className="invalid-feedback">{error.password}</span>
                  </>
                )}
                <input
                  className="input100"
                  type="password"
                  name="password"
                  onChange={formValChange}
                  placeholder="Password"
                />
                <span className="focus-input100" placeholder="Password"></span>
              </div>

              <div
                className="wrap-input100 validate-input m-b-50"
                validate="Enter password"
              >
                {error.confirmPassword.length > 0 && (
                  <>
                    {" "}
                    <span className="invalid-feedback">
                      {error.confirmPassword}
                    </span>
                  </>
                )}
                <input
                  className="input100"
                  type="password"
                  name="confirmPassword"
                  onChange={formValChange}
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

function mapStateToProps(globalState) {
  return {
    signUpMessage: globalState.signUpMessage
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setSignUp: () => dispatch(setSignUp()),
    removeSignUp: () => dispatch(removeSignUp())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RestaurantSignUp);
