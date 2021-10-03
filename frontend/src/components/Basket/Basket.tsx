import React, { useEffect, useState } from "react";
import "./Basket.css";
import basketImage from "./image/basket.svg";
import { DishInBasket } from "../DishInBasket/DishInBasket";

export function Basket(props: any) {
  function totalCount() {
    let total: number = 0;
    props.basketOrders.map((basketOrder: any) => {
      total += basketOrder.count;
      return false;
    });
    return total;
  }

  let count = totalCount();

  function totalMoney() {
    let total:number = 0;
    props.basketOrders.map((basketOrder: any) => {
      total += basketOrder.dishInfo.price * basketOrder.count;
      return false;
    });
    return total;
  }

  let money: number = totalMoney();

  return (
    <div
      className="Basket"
      onClick={event => {
        let target = event.target as HTMLTextAreaElement;
        if (target.matches(".Basket")) {
          props.setOpenBasket();
        }
      }}
    >
      <div className="Basket__wrapper">
        <div className="Basket__block">
          <div className="Basket__header">
            <h3 className="basket__order-amount">
              Your Order <b>({count})</b>
            </h3>
            <svg
              width="24px"
              height="24px"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => {
                props.setOpenBasket();
              }}
              className={"Basket__close"}
            >
              <path
                d="m19.5831 6.24931-1.8333-1.83329-5.75 5.83328-5.75-5.83328-1.8333 1.83329 5.8333 5.74999-5.8333 5.75 1.8333 1.8333 5.75-5.8333 5.75 5.8333 1.8333-1.8333-5.8333-5.75z"
                fill="#1F1F1F"
              ></path>
            </svg>
          </div>

          <div className="Basket__main">
            {props.basketOrders.map((basketOrder: any, i: number) => {
              return (
                <DishInBasket
                  basketOrder={basketOrder}
                  basketOrders={props.basketOrders}
                  removeFromBasket={props.removeFromBasket}
                  addToBasket={props.addToBasket}
                  index={i}
                  key={basketOrder.dishInfo.uuid}
                />
              );
            })}
          </div>
        </div>
        <div className="Basket__payment-wrapper">
          <div className=" Basket__payment">
            <div className="Basket__amount-dishes">{count}</div>
            <span className="basket__next-step">Pay</span>
            <span className="basket__price basket__price--payment">
              {money / 100}$.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
