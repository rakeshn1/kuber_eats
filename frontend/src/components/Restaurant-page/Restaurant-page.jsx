import React, { useState, useEffect } from "react";
import "./Restaurant-page.css";
import { RestaurantPreview } from "../Restaurant-preview/Restaurant-preview";
import { PropositionType } from "./Proposition-type/Proposition-type";
import { Menu } from "./Menu/Menu";
import { BACKEND_HOST, BACKEND_PORT } from "../../config";
import axios from "axios";
import Swal from "sweetalert2";

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
      try {
        axios.defaults.headers.common["authorization"] = JSON.parse(
          localStorage.getItem("token")
        );
        const response = await axios({
          method: "get",
          url: `http://${BACKEND_HOST}:${BACKEND_PORT}/restaurants/${this.state.id}`
          //`https://uber-eats-mates.herokuapp.com/api/v1/restaurants/${this.state.id}`
        });
        const loadedRestaurant = await response.data;
        await this.setState({
          restaurantMenu: loadedRestaurant
        });
      } catch (e) {
        console.log(e);
        if (e.response && e.response.status === 401) {
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
