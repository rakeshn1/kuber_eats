import React, { useState } from "react";
import { connect } from "react-redux";
import "./login.css";
import Swal from "sweetalert2";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { setUser } from "../../redux/user";
import { setIsUserLoggedIn } from "../../redux/userLogin";
import { setToken } from "../../redux/userToken";
import { BACKEND_HOST, BACKEND_PORT } from "../../config";
import { unSetIsRestaurantLoggedIn } from "../../redux/restaurantLogin";

function Login(props) {
  const history = useHistory();

  const initState = {
    email: "",
    password: ""
  };
  const [error, setError] = useState(initState);

  async function handleClick(event) {
    try {
      event.preventDefault();
      const truth =
        event.target.email.value.length > 0 &&
        event.target.password.value.length > 0;
      if (formValid(error) && truth) {
        axios.defaults.withCredentials = true;
        const response = await axios({
          method: "post",
          url: `http://${BACKEND_HOST}:${BACKEND_PORT}/users/login`,
          data: {
            email: event.target.email.value,
            password: event.target.password.value
          }
        });
        if (response.status == 200) {
          localStorage.setItem("user", JSON.stringify(response.data.userData));
          localStorage.setItem("isUserLoggedIn", JSON.stringify(true));
          localStorage.setItem("token", JSON.stringify(response.data.token));
          props.unSetIsRestaurantLoggedIn();
          await props.setIsUserLoggedIn();
          props.setToken(response.data.token);
          props.setUser(response.data.userData);
          history.push("/dashBoard");
        } else {
          throw new Error("Username/Password is invalid");
        }
      } else {
        Swal.fire({
          title: "Please enter all the values in proper format",
          confirmButtonColor: "black"
        });
      }
    } catch (e) {
      console.log(e);
      if (e.response && e.response.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Username/Password is invalid"
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: e
        });
      }
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
        newError.password =
          value.length > 1 ? "" : "Please enter a valid passowrd";
        break;
      default:
        break;
    }

    setError(() => {
      return newError;
    });
  };

  return (
    <>
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100 p-t-85 p-b-20">
            <form
              className="login100-form validate-form"
              onSubmit={handleClick}
            >
              <span className="login100-form-title p-b-70">Welcome back</span>
              <div
                className="wrap-input100 validate-input m-t-85 m-b-35"
                validate="Enter email"
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
                <span className="focus-input100" placeholder="Email ID"></span>
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
              <br />
              <br />
              <div className="container-login100-form-btn">
                <button className="login100-form-btn">Login</button>
              </div>
              <br />
              <br />
              <br />
              <ul className="login-more p-t-190">
                <Link to={"/userSignUp"}>
                  <li className="m-b-8">
                    <p className="txt2">Don't have an account? Sign up here</p>
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

function mapDispatchToProps(dispatch) {
  return {
    setUser: userData => dispatch(setUser(userData)),
    setIsUserLoggedIn: () => dispatch(setIsUserLoggedIn()),
    setToken: token => dispatch(setToken(token)),
    unSetIsRestaurantLoggedIn: () => dispatch(unSetIsRestaurantLoggedIn())
  };
}

export default connect(
  null,
  mapDispatchToProps
)(Login);
