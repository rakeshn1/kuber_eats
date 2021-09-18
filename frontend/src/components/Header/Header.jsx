import React from "react";
import "./Header.css";
import { OrderDelivery } from "../Order-delivery/Order-delivery.jsx";
import { PersonalAreaBar } from "../Personal-area-bar/Personal-area-bar";
import { Link } from "react-router-dom";
import { Container } from "../../Container/Container";

export function Header(props) {
  return (
    <header className="Header">
      <Container>
        <div className="Header__wrapper">
          <div className="Header__logo-wrapper">
            <Link className="Header__logo" to={"/"}></Link>
          </div>
          {props.login && (
              <>
                <div className={"Header__order-delivery"}>
                  <OrderDelivery />
                </div>
              <PersonalAreaBar open={props.open} />
              </>
          )}
        </div>
      </Container>
    </header>
  );
}
