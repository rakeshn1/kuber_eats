import React, { useState, useEffect } from "react";
import "./RestaurantDashboard.css";
import { RestaurantMenu } from "./RestaurantMenu";
import { PropositionType } from "../Restaurant-page/Proposition-type/Proposition-type";

export class RestaurantDishDisplay extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      restaurantMenu: {}
    };
  }

  componentDidMount() {
    (async () => {
      const response = await fetch(
        `https://uber-eats-mates.herokuapp.com/api/v1/restaurants/6585ad84-b9b0-4ab0-be54-f22657cd29bc`
      );
      const loadedRestaurant = await response.json();
      await this.setState({
        restaurantMenu: loadedRestaurant
      });
    })();
  }

  isNotEmpty(obj) {
    for (let key in obj) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <main className="RRestaurant-page">
        {this.isNotEmpty(this.state.restaurantMenu) ? (
          <RestaurantMenu restaurantMenu={this.state.restaurantMenu} />
        ) : (
          ""
        )}
      </main>
    );
  }
}
