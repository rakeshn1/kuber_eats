import React from "react";
import "./RestaurantDashboard.css";

export function DashboardPreview(props) {
  const restaurantMenu = props.restaurantMenu;

  return (
    <section className="RRestaurant-preview__background">
      <img
        src={restaurantMenu.largeImageUrl}
        alt=""
        className={"RRestaurant-preview__back"}
      />
      <div className="RRestaurant-preview__wrapper">
        <div className="Rrestaurant-preview Restaurant-preview">
          <span className="RRestaurant-preview__name Restaurant-preview__name">
            {restaurantMenu.title}
          </span>
        </div>
      </div>
    </section>
  );
}
