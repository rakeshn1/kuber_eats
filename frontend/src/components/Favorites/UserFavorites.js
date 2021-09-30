import React from "react";
import "./UserFavorites.css";
import RestaurantChoose from "../Restaurants-choose/Restaurants-choose";
import { Container } from "../../Container/Container";

export class UserFavorites extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
      restaurants: []
    };
  }

  componentDidMount() {
    (async () => {
      const response = await fetch(
        "https://uber-eats-mates.herokuapp.com/api/v1/restaurants"
      );
      const loadedRestaurants = await response.json();
      await this.setState({
        restaurants: loadedRestaurants
      });
    })();
  }
  render() {
    return (
      <Container>
        <main className="FMain">
          <p className="FMain__city">Your Favorite Restaurants</p>
          <div className="FMain__restaurants-list">
            {this.state.restaurants.length > 0
              ? this.state.restaurants.map((restaurant, i) => {
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
}
