import React, { useEffect, useState } from "react";
import "./UserFavorites.css";
import RestaurantChoose from "../Restaurants-choose/Restaurants-choose";
import { Container } from "../../Container/Container";
import { BACKEND_HOST, BACKEND_PORT } from "../../config";
import { connect } from "react-redux";

function UserFavorites(props) {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `http://${BACKEND_HOST}:${BACKEND_PORT}/restaurants`
        //"https://uber-eats-mates.herokuapp.com/api/v1/restaurants"
      );
      let loadedRestaurants = await response.json();
      await setRestaurants(() => loadedRestaurants);
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
