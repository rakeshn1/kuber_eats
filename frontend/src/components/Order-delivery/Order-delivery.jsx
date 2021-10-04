import React from "react";
import "./Order-delivery.css";
import group from "./image/Group.svg";

export function OrderDelivery() {
  return (
    <div className="Order-delivery">
      <button className="Order-delivery__time" type="button">
        ASAP
      </button>
      <span className="Order-delivery__to">to</span>
      <div className="Order-delivery__location">
        <img src={group} alt="" className="Order-delivery__location-arow" />
        <input
          type="text"
          placeholder="Your location"
          className="Order-delivery__location-enter"
        />
      </div>
    </div>
  );
}
