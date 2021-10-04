import React from "react";
import "./Dish.css";
import Swal from "sweetalert2";

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
      if (orders.length > 0) {
        if (
          orders[0].dishInfo.restaurantID !==
          restaurantMenu.items[props.id].restaurantID
        ) {
          Swal.fire({
            title: "Create new Order?",
            text:
              "Your order contains items from another restaurant. Do you want to discard those and add items from this restaurant?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#57b846",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
          }).then(result => {
            if (result.isConfirmed) {
              orders = [];
              orders.push({
                dishInfo: restaurantMenu.items[props.id],
                count: 1
              });
              props.addToBasket(orders);
              return;
            } else {
              return;
            }
          });
        } else {
          orders.push({
            dishInfo: restaurantMenu.items[props.id],
            count: 1
          });
        }
      } else {
        orders.push({
          dishInfo: restaurantMenu.items[props.id],
          count: 1
        });
      }
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
                restaurantMenu.items[props.id].price}
              $
            </span>
          </div>
        </div>
        {image && <img src={image} alt="" className="Dish__photo" />}
      </div>
    </div>
  );
}
