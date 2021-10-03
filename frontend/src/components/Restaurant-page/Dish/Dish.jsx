import React from "react";
import "./Dish.css";

export function Dish(props) {
  const restaurantMenu = props.restaurantMenu;
  const image = restaurantMenu.items[props.id].imageUrl;
  let orders = [...props.basketOrders];

  function isDishInBasket() {
    return orders.find(order => {
      return order.dishInfo.uuid === props.id;
    });
  }

  function findPositionInBasket() {
    return orders.findIndex(order => {
      return order.dishInfo.uuid === props.id;
    });
  }

  function addingDish() {
    let orders = [...props.basketOrders];
    let isDishInBasket = orders.findIndex(basketOrder => {
      return basketOrder.dishInfo.uuid === props.id;
    });
    if (isDishInBasket !== -1) {
      orders[isDishInBasket].count++;
    } else {
      orders.push({
        dishInfo: restaurantMenu.items[props.id],
        count: 1
      });
    }
    props.addToBasket(orders);
  }

  return (
    <div
      className="Dish"
      onClick={() => {
        addingDish();
      }}
    >
      <div
        className={`Dish__wrapper ${isDishInBasket() ? "Dish__inBasket" : ""}`}
      >
        {isDishInBasket() ? (
          <div className={"Dish__inBasketCount"}>
            {orders[findPositionInBasket()].count}
          </div>
        ) : null}
        <div className="Dish__about">
          <div className="Dish__header">
            <span className="Dish__name">
              {restaurantMenu.items[props.id] &&
                restaurantMenu.items[props.id].title}
            </span>
            <span className="Dish__recipe">
              {restaurantMenu.items[props.id] &&
                restaurantMenu.items[props.id].itemDescription}
            </span>
          </div>
          <div className="dish__footer">
            <span className="dish__price">
              {restaurantMenu.items[props.id] &&
                restaurantMenu.items[props.id].price / 100}
              ₴
            </span>
          </div>
        </div>
        {image && <img src={image} alt="" className="Dish__photo" />}
      </div>
    </div>
  );
}
