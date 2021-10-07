import React, { useEffect, useState } from "react";
import "./UserFavorites.css";
import RestaurantChoose from "../Restaurants-choose/Restaurants-choose";
import { Container } from "../../Container/Container";
import { BACKEND_HOST, BACKEND_PORT } from "../../config";
import { connect } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";

function UserFavorites(props) {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        axios.defaults.headers.common["authorization"] = JSON.parse(
          localStorage.getItem("token")
        );
        const response = await axios({
          method: "get",
          url: `http://${BACKEND_HOST}:${BACKEND_PORT}/restaurants`
          //"https://uber-eats-mates.herokuapp.com/api/v1/restaurants"
        });
        let loadedRestaurants = await response.data;
        await setRestaurants(() => loadedRestaurants);
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

  const ifFavoritesInclude = restaurant => {
    if (props.user.favorites.includes(restaurant.uuid)) {
      return true;
    }
    return false;
  };

  return (
    <Container>
      <main className="FMain">
        <p className="FMain__city">Your Favorite Restaurants</p>
        <div className="FMain__restaurants-list">
          {restaurants.length > 0
            ? restaurants
                .filter((restaurant, i) => {
                  return (
                    props.user.favorites.length > 0 &&
                    ifFavoritesInclude(restaurant)
                  );
                })
                .map((restaurant, i) => {
                  return (
                    <RestaurantChoose
                      key={i}
                      title={restaurant.title}
                      categories={restaurant.categories}
                      priceBucket={restaurant.priceBucket}
                      imageUrl={restaurant.imageUrl}
                      etaRange={restaurant.etaRange}
                      uuid={restaurant.uuid}
                    />
                  );
                })
            : ""}
        </div>
      </main>
    </Container>
  );
}

function mapStateToProps(globalState) {
  return {
    user: globalState.user
  };
}

export default connect(
  mapStateToProps,
  null
)(UserFavorites);
