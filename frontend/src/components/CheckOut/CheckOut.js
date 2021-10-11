import React, { useEffect, useState } from "react";
import "./CheckOut.css";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import axios from "axios";
import { BACKEND_HOST, BACKEND_PORT } from "../../config";

function CheckOut(props) {
  const history = useHistory();
  const basketOrders = JSON.parse(localStorage.getItem("basketOrders")) || [];
  const checkOutTaxes = [
    { name: "Subtotal" },
    { name: "Promotion" },
    { name: "Taxes & Fees" },
    { name: "Delivery Fee" },
    { name: "CA Driver Benefits" },
    { name: "Add a tip" }
  ];
  const [addresses, setAddresses] = useState([]);
  const [selectAddresses, setSelectAddresses] = useState({});

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

  function handleSelect(address) {
    setSelectAddresses(() => address);
  }

  function handleAddItems(e) {
    e.preventDefault();
    if (basketOrders.length > 0) {
      history.push(`/restaurant-page/${basketOrders[0].dishInfo.restaurantID}`);
    } else {
      history.push("/dashBoard");
    }
  }

  async function handleAddAddress(e) {
    e.preventDefault();
    const { value: formValues } = await Swal.fire({
      title: "Add address ",
      html:
        '<input id="addressLine" class="swal2-input" placeholder="Address Line">' +
        '<input id="City" class="swal2-input" placeholder="City">' +
        '<input id="State" class="swal2-input" placeholder=" State">' +
        '<input id="Pincode" class="swal2-input" placeholder="Pincode">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById("addressLine").value,
          document.getElementById("City").value,
          document.getElementById("State").value,
          document.getElementById("Pincode").value
        ];
      }
    });

    if (formValues) {
      let addressObject = {
        addressLine: formValues[0] ? formValues[0] : "",
        city: formValues[1] ? formValues[1] : "",
        state: formValues[2] ? formValues[2] : "",
        pinCode: formValues[3] ? formValues[3] : ""
      };
      setAddresses(prev => {
        let newArray = [...prev, addressObject];
        return newArray;
      });
    }
  }

  async function handleClick(event) {
    try {
      event.preventDefault();
      let updatedData = {
        description: basketOrders,
        totalCost: money,
        dateTime: new Date().toISOString(),
        status: "newOrder",
        deliveryType: props.deliveryType,
        deliveryStatus: "orderReceived",
        customerID: props.user.id,
        restaurantID: basketOrders[0].dishInfo.restaurantID,
        address: selectAddresses.addressLine
          ? selectAddresses
          : props.user.address
      };
      axios.defaults.headers.common["authorization"] = JSON.parse(
        localStorage.getItem("token")
      );
      const response = await axios({
        method: "post",
        url: `http://${BACKEND_HOST}:${BACKEND_PORT}/users/createOrder`,
        data: updatedData
      });
      if (response.status == 200) {
        Swal.fire("Successfully placed the order", "", "success");
        props.clearBasket();
        history.push("/userOrders");
      } else {
        throw new Error(response.data.msg);
      }
    } catch (e) {
      console.log(e);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: e
      });
    }
  }

  return (
    <div className="CBasket">
      <div className="CBasket__wrapperT">
        <div className="CBasket__blockT">
          <div>
            <br />
            <h2>Delivery address</h2>
            <div className={"Menu__list"}>
              <div
                className="Dish"
                onClick={() => handleSelect(props.user.address)}
              >
                <div
                  className={`Dish__wrapper ${
                    selectAddresses.addressLine ===
                    props.user.address.addressLine
                      ? "Dish__inBasket"
                      : ""
                  }`}
                >
                  <div className="Dish__about">
                    <div className="Dish__header">
                      <span className="Dish__name">{"Default"}</span>
                      <span className="Dish__recipe">
                        {props.user.address.addressLine} ,
                      </span>
                      <span className="Dish__recipe">
                        {props.user.address.city} ,
                      </span>
                      <span className="Dish__recipe">
                        {props.user.address.state} ,
                      </span>
                      <span className="Dish__recipe">
                        {props.user.address.pinCode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {addresses.length > 0 &&
                addresses.map(address => {
                  return (
                    <div className="Dish" onClick={() => handleSelect(address)}>
                      <div
                        className={`Dish__wrapper ${
                          selectAddresses.addressLine === address.addressLine
                            ? "Dish__inBasket"
                            : ""
                        }`}
                      >
                        <div className="Dish__about">
                          <div className="Dish__header">
                            <span className="Dish__name">
                              {`Additional address ${addresses.indexOf(
                                address
                              ) + 1}`}
                            </span>
                            <span className="Dish__recipe">
                              {address.addressLine} ,
                            </span>
                            <span className="Dish__recipe">
                              {address.city} ,
                            </span>
                            <span className="Dish__recipe">
                              {address.state} ,
                            </span>
                            <span className="Dish__recipe">
                              {address.pinCode}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            <div>
              <span className="coButtonA" onClick={handleAddAddress}>
                + Add address
              </span>
            </div>
          </div>
          <div className="CBasket__headerT">
            <h3 className="basket__order-amountT">Your Order</h3>
            <span className="coButton" onClick={handleAddItems}>
              + Add items
            </span>
          </div>

          <div className="CBasket__mainT">
            {basketOrders.map((basketOrder, i) => {
              return (
                <div
                  className="MCBasket__chooseT"
                  key={basketOrder.dishInfo.uuid}
                >
                  <span className="MCBasket__selectT">{basketOrder.count}</span>
                  <span className="MCbasket__dishT">
                    {basketOrder.dishInfo.title}
                  </span>
                  <span className="MCbasket__priceT">
                    ${basketOrder.dishInfo.price * basketOrder.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="CBasket__payment-wrapper">
          <div className=" CBasket__paymentT">
            <div className="CBasket__amount-dishes">{count}</div>
            <span className="Cbasket__next-step">Total</span>
            <span className="Cbasket__price basket__price--payment">
              {money}$.
            </span>
          </div>
        </div>
      </div>
      <div className="CBasket__wrapper" onClick={handleClick}>
        <div className="CBasket__block">
          <div className="CBasket__payment-wrapper">
            <div className=" CBasket__payment">
              <span className="Cbasket__next-stepT">Place Order</span>
            </div>
          </div>
          <br />
          <div>
            <span className="extraContent">
              If you’re not around when the delivery person arrives, they’ll
              leave your order at the door. By placing your order, you agree to
              take full responsibility for it once it’s delivered.
            </span>
          </div>
          <div className="CBasket__main">
            {checkOutTaxes.map((basketOrder, i) => {
              return (
                <div className="MCBasket__choose" key={basketOrder.name}>
                  <span className="MCBasket__select"></span>
                  <span className="MCbasket__dish">{basketOrder.name}</span>
                  <span className="MCbasket__price">$ 0.00</span>
                </div>
              );
            })}
          </div>
          <div className="CBasket__header">
            <h3 className="basket__order-amount">Total</h3>
            <span>${money}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(globalState) {
  return {
    user: globalState.user,
    deliveryType: globalState.deliveryType
  };
}

export default connect(
  mapStateToProps,
  null
)(CheckOut);
