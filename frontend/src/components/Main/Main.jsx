import React, { useState, useEffect } from "react";
import "./Main.css";
import { Search } from "../Search/Search";
import RestaurantChoose from "../Restaurants-choose/Restaurants-choose";
import { Container } from "../../Container/Container";
import { connect } from "react-redux";
import { BACKEND_HOST, BACKEND_PORT } from "../../config";

function Main(props) {
  const [searchValue, setSearchValue] = useState("");
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `http://${BACKEND_HOST}:${BACKEND_PORT}/restaurants`
        //"https://uber-eats-mates.herokuapp.com/api/v1/restaurants"
      );
      let loadedRestaurants = await response.json();
      //********************************TOBEDELETED*********************************************************************************
      for (let i = 0; i < loadedRestaurants.length; i++) {
        if (i % 2 === 0) {
          loadedRestaurants[i].deliveryType = [
            { value: "delivery", label: "Delivery" }
          ];
          loadedRestaurants[i].location = "Sunnyvale";
          loadedRestaurants[i].dietary = [{ value: "vegan", label: "Vegan" }];
        } else {
          loadedRestaurants[i].deliveryType = [
            { value: "delivery", label: "Delivery" },
            { value: "pickUp", label: "Pick up" }
          ];
          loadedRestaurants[i].location = "SanJose";
          loadedRestaurants[i].dietary = [
            { value: "nonVegetarian", label: "Non Vegetarian" },
            { value: "vegetarian", label: "Vegetarian" }
          ];
        }
      }
      //       loadedRestaurants[0].deliveryType = [{ value: "delivery", label: "Delivery" }]
      //       loadedRestaurants[0].dietary = [{ value: "vegetarian", label: "Vegetarian" }]
      //       loadedRestaurants[0].location = "Sunnyvale"
      //       loadedRestaurants[1].deliveryType = [{ value: "delivery", label: "Delivery" },
      //         { value: "pickUp", label: "Pick up" }]
      //       loadedRestaurants[1].dietary = [{ value: "nonVegetarian", label: "Non Vegetarian" },{ value: "vegetarian", label: "Vegetarian" }]
      //       loadedRestaurants[1].location = "San Jose"
      //       loadedRestaurants[2].deliveryType = [{ value: "delivery", label: "Delivery" },
      //         { value: "pickUp", label: "Pick up" }]
      //       loadedRestaurants[2].dietary = [{ value: "vegan", label: "Vegan" }]
      //       loadedRestaurants[2].location = "San Jose"
      //       loadedRestaurants = loadedRestaurants.slice(0,3)
      //********************************TOBEDELETED*********************************************************************************
      await setRestaurants(() => loadedRestaurants);
    })();
  }, []);

  const updateSearch = input => {
    setSearchValue(() => input);
  };

  const ifTagsInclude = restaurant => {
    for (let i = 0; i < restaurant.tags.length; i++) {
      if (
        restaurant.tags[i].name
          .toLowerCase()
          .includes(searchValue.toLocaleLowerCase())
      ) {
        return true;
      }
    }
    return false;
  };

  const ifCategoriesInclude = restaurant => {
    for (let i = 0; i < restaurant.categories.length; i++) {
      if (
        restaurant.categories[i].name
          .toLowerCase()
          .includes(searchValue.toLocaleLowerCase())
      ) {
        return true;
      }
    }
    return false;
  };

  const ifDietaryInclude = restaurant => {
    if (!props.dietary.length > 0) {
      return true;
    }
    for (let i = 0; i < restaurant.dietary.length; i++) {
      for (let j = 0; j < props.dietary.length; j++) {
        if (restaurant.dietary[i].value.includes(props.dietary[j])) {
          return true;
        }
      }
    }
    return false;
  };

  const ifDeliveryTypeInclude = restaurant => {
    for (let i = 0; i < restaurant.deliveryType.length; i++) {
      if (
        restaurant.deliveryType[i].value
          .toLowerCase()
          .includes(props.deliveryType.toLocaleLowerCase())
      ) {
        return true;
      }
    }
    return false;
  };

  const ifLocationInclude = restaurant => {
    if (
      restaurant.location
        .toLowerCase()
        .includes(props.location.toLocaleLowerCase())
    ) {
      return true;
    }
    return false;
  };

  return (
    <Container>
      <main className="Main">
        <Search updateSearch={updateSearch} />
        <p className="Main__city">Restaurants</p>
        <div className="Main__restaurants-list">
          {restaurants.length > 0
            ? restaurants
                .filter((restaurant, i) => {
                  return (
                    restaurant.location &&
                    ifLocationInclude(restaurant) &&
                    (restaurant.deliveryType &&
                      ifDeliveryTypeInclude(restaurant)) &&
                    (restaurant.dietary && ifDietaryInclude(restaurant)) &&
                    (restaurant.title
                      .toLowerCase()
                      .includes(searchValue.toLocaleLowerCase()) ||
                      (restaurant.tags && ifTagsInclude(restaurant)) ||
                      ifCategoriesInclude(restaurant))
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
        <div className="Main__restaurants-list">
          {restaurants.length > 0
            ? restaurants
                .filter((restaurant, i) => {
                  return (
                    !(restaurant.location && ifLocationInclude(restaurant)) &&
                    (restaurant.deliveryType &&
                      ifDeliveryTypeInclude(restaurant)) &&
                    (restaurant.dietary && ifDietaryInclude(restaurant)) &&
                    (restaurant.title
                      .toLowerCase()
                      .includes(searchValue.toLocaleLowerCase()) ||
                      (restaurant.tags && ifTagsInclude(restaurant)) ||
                      ifCategoriesInclude(restaurant))
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
    isUserLoggedIn: globalState.isUserLoggedIn,
    deliveryType: globalState.deliveryType,
    location: globalState.location,
    dietary: globalState.dietary
  };
}

export default connect(
  mapStateToProps,
  null
)(Main);
