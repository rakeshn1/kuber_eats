import React from "react"
import "./login.css";
import { Link } from "react-router-dom";
const axios = require('axios');

export default function Login(props){
    async function handleClick(event){
        try{
            event.preventDefault();
            const response = await axios({
                method: 'post',
                url: 'http://localhost:5676/users/login',
                data: {
                    "name": event.target.username.value,
                    "password": event.target.password.value
                }
            });
            if(response.status == 200){
                //return <Redirect to={"/dashBoard"} />
                props.setIsLoggedIn();
            }else{
                alert(response.data)
            }
        }catch (e) {
            console.log(e)
            alert(e)
        }
    }
    return(
        <>
            <div className="limiter">
                <div className="container-login100">
                    <div className="wrap-login100 p-t-85 p-b-20">
                        <form className="login100-form validate-form" onSubmit={handleClick}>
					<span className="login100-form-title p-b-70">
						Welcome back
					</span>
                            <div className="wrap-input100 validate-input m-t-85 m-b-35" validate="Enter username">
                                <input className="input100" type="text" name="username" placeholder="Username"/>
                                <span className="focus-input100" placeholder="Username"></span>
                            </div>

                            <div className="wrap-input100 validate-input m-b-50" validate="Enter password">
                                <input className="input100" type="password" name="password" placeholder="Password"/>
                                    <span className="focus-input100" placeholder="Password"></span>
                            </div>
                            <br/>
                            <br/>
                            <div className="container-login100-form-btn">
                                <button className="login100-form-btn">
                                    Login
                                </button>
                            </div>
                            <br/><br/>
                            <ul className="login-more p-t-190">
                                <li className="m-b-8">
							<span className="txt1">
								Forgot
							</span>
                                    <p href="#" className="txt2">
                                        Username / Password?
                                    </p>
                                </li>

                                <li>
							<span className="txt1">
								Don’t have an account?
							</span>

                                    <p href="#" className="txt2">
                                        Sign up
                                    </p>
                                </li>
                            </ul>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}