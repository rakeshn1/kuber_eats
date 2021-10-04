import React, { useState } from "react";

export function DishInBasket(props) {
  const [count, setCount] = useState(props.basketOrder.count);
  const basketOrders = props.basketOrders;
  function onSelectChange(event) {
    if (event.target.value === "delete") {
      props.removeFromBasket(props.basketOrder);
    } else {
      setCount(event.target.value);
      basketOrders[props.index].count = +event.target.value;
      props.addToBasket(basketOrders);
    }
  }

  return (
    <div className="Basket__choose" key={props.basketOrder.dishInfo.uuid}>
      <select
        onChange={onSelectChange}
        className="Basket__select"
        defaultValue={props.basketOrder.count}
      >
        <option value={"delete"}>Remove item</option>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
        <option value={6}>6</option>
        <option value={7}>7</option>
        <option value={8}>8</option>
        <option value={9}>9</option>
        <option value={10}>10</option>
      </select>
      <span className="basket__dish">{props.basketOrder.dishInfo.title}</span>
      <span className="basket__price">
        {props.basketOrder.dishInfo.price * count}$.
      </span>
    </div>
  );
}
