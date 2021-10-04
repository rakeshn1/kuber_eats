import React, { useState, useEffect } from "react";
import "./Restaurant-page.css";
import { RestaurantPreview } from "../Restaurant-preview/Restaurant-preview";
import { PropositionType } from "./Proposition-type/Proposition-type";
import { Menu } from "./Menu/Menu";
import { BACKEND_HOST, BACKEND_PORT } from "../../config";

export class RestaurantPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      restaurantMenu: {},
      id: props.match.params.id
    };
  }

  componentDidMount() {
    (async () => {
      const response = await fetch(
        `http://${BACKEND_HOST}:${BACKEND_PORT}/restaurants/${this.state.id}`
        //`https://uber-eats-mates.herokuapp.com/api/v1/restaurants/${this.state.id}`
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
      <main className="Restaurant-page">
        {this.isNotEmpty(this.state.restaurantMenu) ? (
          <RestaurantPreview restaurantMenu={this.state.restaurantMenu} />
        ) : (
          ""
        )}
        {this.isNotEmpty(this.state.restaurantMenu) ? (
          <PropositionType restaurantMenu={this.state.restaurantMenu} />
        ) : (
          ""
        )}
        {this.isNotEmpty(this.state.restaurantMenu) ? (
          <Menu
            addToBasket={this.props.addToBasket}
            basketOrders={this.props.basketOrders}
            restaurantMenu={this.state.restaurantMenu}
          />
        ) : (
          ""
        )}
      </main>
    );
  }
}
