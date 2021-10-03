import React from "react";
import "./Restaurant-preview.css";

export function RestaurantPreview(props) {
  const restaurantMenu = props.restaurantMenu;

  return (
    <section className="Restaurant-preview__background">
      <img
        src={props.restaurantMenu.largeImageUrl}
        alt=""
        className={"Restaurant-preview__back"}
      />
      <div className="Restaurant-preview__wrapper">
        <div className="restaurant-preview Restaurant-preview">
          <span className="Restaurant-preview__name Restaurant-preview__name">
            {restaurantMenu.title}
          </span>
          <div className={"Restaurant-preview__footer"}>
            <span className="Restaurant-preview__about">
              {restaurantMenu.priceBucket}{" "}
              {restaurantMenu.categories.map(categorie => {
                return ` • ${categorie.name}`;
              })}{" "}
            </span>
            <span className="Restaurant-preview__delivery-time">
              {/*{restaurantMenu.etaRange.min} - {restaurantMenu.etaRange.max}*/}
              30 min
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
