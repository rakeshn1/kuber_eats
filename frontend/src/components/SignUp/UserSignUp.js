import React from "react";
import "./UserSignUp.css";
import Swal from "sweetalert2";
import { Link, useHistory } from "react-router-dom";
import { BACKEND_HOST, BACKEND_PORT } from "../../config";
const axios = require("axios");

function UserSignUp(props) {
  const history = useHistory();
  async function handleClick(event) {
    try {
      event.preventDefault();
      const response = await axios({
        method: "post",
        url: `http://${BACKEND_HOST}:${BACKEND_PORT}/users/create`,
        data: {
          name: event.target.username.value,
          email: event.target.email.value,
          password: event.target.password.value,
          favorites: []
        }
      });
      if (response.status == 200) {
        Swal.fire("Sign up successful!", "Get ready to crave", "success");
        history.push("/");
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
              <span className="login100-form-title p-b-70">User Sign up</span>
              <div
                className="wrap-input100 validate-input m-t-85 m-b-35"
                validate="Enter username"
              >
                <input
                  className="input100"
                  type="text"
                  name="username"
                  placeholder="Username"
                />
                <span className="focus-input100" placeholder="Username"></span>
              </div>
              <div
                className="wrap-input100 validate-input m-t-85 m-b-35"
                validate="Enter username"
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
                <Link to={"/"}>
                  <li className="m-b-8">
                    <p className="txt2">Login</p>
                  </li>
                </Link>
              </ul>
              <br />
              <ul className="login-more p-t-190">
                <Link to={"/restaurantSignup"}>
                  <li className="m-b-8">
                    {/*<p className="txt1">*/}
                    {/*	Forgot*/}
                    {/*</p>*/}
                    <p className="txt2">Restaurant Sign up</p>
                  </li>
                </Link>
                <Link to={"/restaurantLogin"}>
                  <li>
                    {/*<p className="txt1">*/}
                    {/*	Don’t have an account?*/}
                    {/*</p>*/}

                    <p className="txt2">Restaurant Login</p>
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

export default UserSignUp;
