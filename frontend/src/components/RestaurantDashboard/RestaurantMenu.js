import React, { useState, useEffect } from "react";
import "./RestaurantDashboard.css";
import RestaurantDish from "./RestaurantDish";

export class RestaurantMenu extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className="Rmenu">
        <div className="RMenu__wrapper">
          {this.props.restaurantMenu
            ? this.props.restaurantMenu.sections.map((section, i) => {
                return (
                  <div key={section.uuid} className="RMenu_title">
                    <span className={"RMenu__type"} id={`${section.title}`}>
                      {section.title}
                    </span>
                    <div className={"RMenu__list"}>
                      {section.itemUuids.map((item, i) => {
                        return (
                          <RestaurantDish
                            key={item}
                            restaurantMenu={this.props.restaurantMenu}
                            id={item}
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
