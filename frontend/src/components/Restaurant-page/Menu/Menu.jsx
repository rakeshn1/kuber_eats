import React, { useState, useEffect } from "react";
import "./Menu.css";
import { Dish } from "../Dish/Dish";

export class Menu extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className="menu">
        <div className="Menu__wrapper">
          {this.props.restaurantMenu
            ? this.props.restaurantMenu.sections.map((section, i) => {
                return (
                  <div key={section.uuid}>
                    <span className={"Menu__type"} id={`${section.title}`}>
                      {section.title}
                    </span>
                    <div className={"Menu__list"}>
                      {section.itemUuids.map((item, i) => {
                        return (
                          <Dish
                            restaurantMenu={this.props.restaurantMenu}
                            id={item}
                            basketOrders={this.props.basketOrders}
                            key={item}
                            addToBasket={this.props.addToBasket}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })
            : ""}
          ;
        </div>
      </section>
    );
  }
}
