import React, { useState, useEffect } from "react";
import "./RestaurantDashboard.css";
import { connect } from "react-redux";
import { RestaurantMenu } from "./RestaurantMenu";
import { PropositionType } from "../Restaurant-page/Proposition-type/Proposition-type";
import { BACKEND_HOST, BACKEND_PORT } from "../../config";

function RestaurantDishDisplay(props) {
  const [restaurantMenu, setRestaurantMenu] = useState({});
  const restaurant = JSON.parse(localStorage.getItem("restaurant"));

  useEffect(() => {
    (async () => {
      const url = `http://${BACKEND_HOST}:${BACKEND_PORT}/restaurants/${props
        .restaurantData.id || (restaurant ? restaurant.id : 100)}`;
      const response = await fetch(
        url
        //`https://uber-eats-mates.herokuapp.com/api/v1/restaurants/6585ad84-b9b0-4ab0-be54-f22657cd29bc`
      );
      const loadedRestaurant = await response.json();
      setRestaurantMenu(() => loadedRestaurant);
    })();
  }, []);

  function isNotEmpty(obj) {
    for (let key in obj) {
      return true;
    }
    return false;
  }

  return (
    <main className="RRestaurant-page">
      {isNotEmpty(restaurantMenu) ? (
        <RestaurantMenu restaurantMenu={restaurantMenu} />
      ) : (
        ""
      )}
    </main>
  );
}

function mapStateToProps(globalState) {
  return {
    restaurantData: globalState.restaurant
  };
}

export default connect(
  mapStateToProps,
  null
)(RestaurantDishDisplay);
