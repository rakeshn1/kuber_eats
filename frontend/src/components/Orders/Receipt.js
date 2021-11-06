import React, { useEffect, useState, useRef } from "react";
import "./Receipt.css";
import {
  allDeliveryStatus,
  allDeliveryTypes,
  allOrderStatus
} from "../DropDown/CommonDropDownOptions";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination
} from "@material-ui/core";
import axios from "axios";
import { BACKEND_HOST, BACKEND_PORT } from "../../config";
import { connect } from "react-redux";
import * as AiIcons from "react-icons/ai";

function Receipt(props) {
  const modalRef = useRef();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [cancelStatus, setCancelStatus] = useState("");
  const basketOrders = JSON.parse(props.order.description);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChange = name => event => {
    props.changeDietary(name);
  };

  const closeModal = e => {
    if (modalRef.current === e.target) {
      props.setOptions();
    }
  };

  const closeModalOnX = () => {
    props.setOptions();
  };

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

  async function handleClick(e) {
    e.preventDefault();
    try {
      const response = await axios({
        method: "put",
        url: `http://${BACKEND_HOST}:${BACKEND_PORT}/restaurants/orderUpdate`,
        data: {
          deliveryStatus: "cancelled",
          status: "cancelledOrder",
          id: props.order.id
        }
      });
      if (response.status === 200) {
        props.changeOrderStatus(props.order.id);
        //props.order.deliveryStatus = "cancelledOrder"
        setCancelStatus(() => "Order Cancelled successfully");
      } else {
        throw new Error("Failed updating");
      }
    } catch (e) {
      console.log(e);
      setCancelStatus(
        () => "Order couldn't be cancelled due to error: " + e.msg
      );
    }
  }

  return (
    <div className="RBasket" onClick={closeModal} ref={modalRef}>
      <div className="RBasket__wrapper">
        <div className="RBasket__block">
          <div className="closeIcon" onClick={closeModalOnX}>
            <AiIcons.AiOutlineClose />
          </div>
          <div className="RBasket__header">
            <h4 className="Mbasket__order-amount">Receipt</h4>
          </div>

          <div className="RBasket__payment-wrapper">
            <div className=" RBasket__payment">
              <div className="RBasket__amount-dishes">{count}</div>
              <span className="Rbasket__next-step">Total</span>
              <span className="Rbasket__price Mbasket__price--payment">
                ${money}
              </span>
            </div>
          </div>

          <Table className="TdMain">
            <TableBody>
              {basketOrders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((basketOrder, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell
                        className="px-01"
                        style={{
                          fontSize: "large",
                          textAlign: "left",
                          fontFamily: "UberMoveText-Medium,Helvetica,sans-serif"
                        }}
                      >
                        {basketOrder.count}
                      </TableCell>
                      <TableCell
                        className="px-01"
                        style={{
                          fontSize: "large",
                          textAlign: "center",
                          fontFamily: "UberMoveText-Medium,Helvetica,sans-serif"
                        }}
                      >
                        {basketOrder.dishInfo.title}
                      </TableCell>
                      <TableCell
                        className="px-01"
                        style={{
                          fontSize: "large",
                          textAlign: "right",
                          fontFamily: "UberMoveText-Medium,Helvetica,sans-serif"
                        }}
                      >
                        ${basketOrder.dishInfo.price * basketOrder.count}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>

          <TablePagination
            className="px-4"
            rowsPerPageOptions={[5, 10, 2]}
            component="div"
            count={basketOrders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              "aria-label": "Previous Page"
            }}
            nextIconButtonProps={{
              "aria-label": "Next Page"
            }}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
        {props.order.deliveryNote && props.order.deliveryNote.length > 0 && (
          <div className="RBasket__main">
            Delivery Note:{" "}
            <span className="<Mbasket__dish">{props.order.deliveryNote}</span>
          </div>
        )}
        <div className="RBasket__main">
          Order status :{" "}
          <span className="<Mbasket__dish">
            {allDeliveryStatus[props.order.deliveryStatus]}
          </span>
        </div>
        {!props.restView && (
          <div className="RBasket__main">
            Delivery address :{" "}
            <span className="Mbasket__dish">
              {JSON.parse(props.order.address).addressLine}
            </span>
          </div>
        )}
        <div>
          {props.order.deliveryStatus === "orderReceived" && (
            <div className="CancelButton" onClick={handleClick}>
              <span>Cancel Order</span>
            </div>
          )}
          {props.order.deliveryStatus !== "cancelled" &&
            props.order.deliveryStatus !== "orderReceived" && (
              <div className="status">
                <span>Order cannot be cancelled at this stage</span>
              </div>
            )}
          {cancelStatus && (
            <div className="status">
              <span>{cancelStatus}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    //changeDietary: dietaryType => dispatch(changeDietary(dietaryType))
  };
}

function mapStateToProps(globalState) {
  return {
    dietary: globalState.dietary
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Receipt);
