import React from "react";
import "./RestaurantDashboard.css";

export function RestaurantDish(props) {
  const restaurantMenu = props.restaurantMenu;
  const image = restaurantMenu.items[props.id].imageUrl;

  return (
    <div className={`RDish__wrapper`}>
      <div className="RDish__about">
        <div className="RDish__header">
          <span className="RDish__name">
            {restaurantMenu.items[props.id] &&
              restaurantMenu.items[props.id].title}
          </span>
          <span className="RDish__recipe">
            {restaurantMenu.items[props.id] &&
              restaurantMenu.items[props.id].itemDescription}
          </span>
        </div>
        <div className="Rdish__footer">
          <span className="Rdish__price">
            {restaurantMenu.items[props.id] &&
              restaurantMenu.items[props.id].price / 100}
            $
          </span>
        </div>
      </div>
      {image && <img src={image} alt="" className="RDish__photo" />}
    </div>
  );
}
