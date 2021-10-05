import React, { useState, useEffect } from "react";
import "./RestaurantDashboard.css";
import { connect } from "react-redux";
import { RestaurantMenu } from "./RestaurantMenu";
import { PropositionType } from "../Restaurant-page/Proposition-type/Proposition-type";
import { BACKEND_HOST, BACKEND_PORT } from "../../config";
import axios from "axios";
import Swal from "sweetalert2";

function RestaurantDishDisplay(props) {
  const [restaurantMenu, setRestaurantMenu] = useState({});
  const restaurant = JSON.parse(localStorage.getItem("restaurant"));

  useEffect(() => {
    (async () => {
      // const url = `http://${BACKEND_HOST}:${BACKEND_PORT}/restaurants/${props
      //   .restaurantData.id || (restaurant ? restaurant.id : 100)}`;
      // const response = await fetch(
      //   url
      //   //`https://uber-eats-mates.herokuapp.com/api/v1/restaurants/6585ad84-b9b0-4ab0-be54-f22657cd29bc`
      // );
      // const loadedRestaurant = await response.json();
      // setRestaurantMenu(() => loadedRestaurant);
      try {
        axios.defaults.headers.common["authorization"] = JSON.parse(
          localStorage.getItem("token")
        );
        const response = await axios({
          method: "get",
          url: `http://${BACKEND_HOST}:${BACKEND_PORT}/restaurants/${
            props.restaurantData.id ? props.restaurantData.id : restaurant.id
          }` //${this.state.id}`
        });
        const loadedRestaurant = await response.data;
        setRestaurantMenu(() => loadedRestaurant);
      } catch (e) {
        console.log(e);
        if (e.response.status === 401) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Unauthorized to access API"
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: e
          });
        }
      }
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
