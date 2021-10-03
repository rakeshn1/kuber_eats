import React from "react";
import "./Footer.css";
import whiteLogo from "./image/white-logo.svg";

export function Footer() {
  return (
    <footer className="Footer">
      <div className="Footer__wrapper">
        <img src={whiteLogo} alt="Uber Eats logo" className="Footer__logo" />
      </div>
    </footer>
  );
}
