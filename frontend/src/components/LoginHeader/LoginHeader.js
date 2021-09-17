import React from "react";
import "./LoginHeader.css";
import { OrderDelivery } from "../Order-delivery/Order-delivery.jsx";
import { PersonalAreaBar } from "../Personal-area-bar/Personal-area-bar";
import { Link } from "react-router-dom";
import { Container } from "../../Container/Container";
import ub from "../Header/image/uber.svg";

export function LoginHeader(props) {
    return (
        <header className="LoginHeader">
            <Container>
                <div className="LoginHeader__wrapper">
                    <div className="LoginHeader__logo-wrapper">
                        <Link className="LoginHeader__logo" to={"/"}></Link>
                        <img
                            src={ub}
                            alt="basket"
                            className="image"
                        />
                    </div>
                </div>
            </Container>
        </header>
    );
}
