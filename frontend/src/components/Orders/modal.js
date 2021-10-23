import React, { useState } from "react";
import "./modal.css";
import { allDeliveryStatus } from "../DropDown/CommonDropDownOptions";

export default function Test(props) {
  const basketOrders = JSON.parse(props.order.description);

  function totalCount() {
    let total = 0;
    basketOrders.map(basketOrder => {
      total += basketOrder.count;
      return false;
    });
    return total;
  }

  let count = totalCount();

  function totalMoney() {
    let total = 0;
    basketOrders.map(basketOrder => {
      total += basketOrder.dishInfo.price * basketOrder.count;
      return false;
    });
    return Math.round(total * 100) / 100;
  }

  let money = totalMoney();

  return (
    <div className="MBasket__wrapper">
      <div className="MBasket__block">
        <div className="MBasket__header">
          <h4 className="Mbasket__order-amount">Receipt</h4>
        </div>

        <div className="MBasket__payment-wrapper">
          <div className=" MBasket__payment">
            <div className="MBasket__amount-dishes">{count}</div>
            <span className="Mbasket__next-step">Total</span>
            <span className="Mbasket__price Mbasket__price--payment">
              ${money}
            </span>
          </div>
        </div>

        <div className="MBasket__main">
          {basketOrders.map((basketOrder, i) => {
            return (
              <div className="MBasket__choose" key={basketOrder.dishInfo.uuid}>
                <span className="MBasket__select">{basketOrder.count}</span>
                <span className="Mbasket__dish">
                  {basketOrder.dishInfo.title}
                </span>
                <span className="Mbasket__price">
                  ${basketOrder.dishInfo.price * basketOrder.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="MBasket__main">
        Order status :{" "}
        <span className="Mbasket__dish">
          {allDeliveryStatus[props.order.deliveryStatus]}
        </span>
      </div>
      {!props.restView && (
        <div className="MBasket__main">
          Delivery address :{" "}
          <span className="Mbasket__dish">
            {JSON.parse(props.order.address).addressLine}
          </span>
        </div>
      )}
    </div>
  );
}
