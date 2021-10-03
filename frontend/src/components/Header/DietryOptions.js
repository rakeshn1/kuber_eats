import React, { useEffect, useState, useRef } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import "./DietryOptions.css";
import chick from "./image/chick.svg";
import leaf from "./image/leaf.svg";
import heart from "./image/heart.svg";
import { changeDietary } from "../../redux/dietary";
import { connect } from "react-redux";

function DietryOptions(props) {
  const modalRef = useRef();

  const handleChange = name => event => {
    props.changeDietary(name);
  };

  const closeModal = e => {
    if (modalRef.current === e.target) {
      props.setOptions();
    }
  };

  return (
    <div className="DietryOptions" onClick={closeModal} ref={modalRef}>
      <div className="DietryOptions__wrapper">
        <div className="DietryOptions__block">
          <div className="DietryOptions__main">
            <div>
              <img src={leaf} alt="downArrow" className="Dietry_opt_img" />
              <span className="DietryOptions_lia">Vegetarian</span>
              <Checkbox
                checked={
                  props.dietary.length > 0 &&
                  props.dietary.includes("vegetarian")
                }
                onChange={handleChange("vegetarian")}
                value="vegetarian"
                style={{
                  color: "#101312"
                }}
              />
            </div>
            <div>
              <img src={chick} alt="opt_img" className="Dietry_opt_img" />
              <span className="DietryOptions_lib">Non vegetarian</span>
              <Checkbox
                checked={
                  props.dietary.length > 0 &&
                  props.dietary.includes("nonVegetarian")
                }
                onChange={handleChange("nonVegetarian")}
                value="nonVegetarian"
                style={{
                  color: "#101312"
                }}
              />
            </div>
            <div>
              <img src={heart} alt="opt_img" className="Dietry_opt_img" />
              <span className="DietryOptions_lic">Vegan</span>
              <Checkbox
                checked={
                  props.dietary.length > 0 && props.dietary.includes("vegan")
                }
                onChange={handleChange("vegan")}
                value="vegan"
                style={{
                  color: "#101312"
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    changeDietary: dietaryType => dispatch(changeDietary(dietaryType))
  };
}

function mapStateToProps(globalState) {
  return {
    dietary: globalState.dietary
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DietryOptions);
