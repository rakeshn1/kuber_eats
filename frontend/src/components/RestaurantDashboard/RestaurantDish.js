import React from "react";
import "./RestaurantDashboard.css";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { setDish, setImageUrl } from "../../redux/dish";
import * as MdIcons from "react-icons/md";

function RestaurantDish(props) {
  const history = useHistory();
  const restaurantMenu = props.restaurantMenu;
  const image = restaurantMenu.items[props.id].imageUrl;

  function selectDish() {
    props.setDish(restaurantMenu.items[props.id]);
    history.push("/addDish");
  }

  return (
    <div className="RDish">
      <div className={`RDish__wrapper`}>
        <div className="RDish__about">
          <div className="RDish__header">
            <span className="RDish__name">
              {restaurantMenu.items[props.id] &&
                restaurantMenu.items[props.id].title}
            </span>
            <span className="RDish__recipe">
              {" "}
              Ingredients:
              {restaurantMenu.items[props.id] &&
                restaurantMenu.items[props.id].ingredients}
            </span>
            <span className="RDish__recipe">
              {restaurantMenu.items[props.id] &&
                restaurantMenu.items[props.id].itemDescription}
            </span>
          </div>
          <div className="Rdish__footer">
            <span className="Rdish__price">
              {restaurantMenu.items[props.id] &&
                restaurantMenu.items[props.id].price}
              $
            </span>
          </div>
        </div>
        {image && <img src={image} alt="" className="RDish__photo" />}
      </div>
      <MdIcons.MdModeEdit
        style={{ height: "20px", width: "40px", cursor: "pointer" }}
        onClick={selectDish}
      ></MdIcons.MdModeEdit>
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    setDish: dishData => dispatch(setDish(dishData))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(RestaurantDish);
