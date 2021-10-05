import React from "react";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination
} from "@material-ui/core";
import "./restaurantOrders.css";
import { Container } from "../../Container/Container";
import axios from "axios";
import Swal from "@sweetalert/with-react";
import Swal2 from "sweetalert2";
import { BACKEND_HOST, BACKEND_PORT } from "../../config";
import { default as ReactSelect } from "react-select";
import { OrderDeliveryTypes } from "../DropDown/OrderDeliveryTypes";
import Option from "../DropDown/Option";
import Test from "./modal";

const UserOrders = props => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [orders, setOrders] = useState([]);
  const [filterOrders, setFilterOrders] = useState([]);
  const [optionSelected, setOptionSelected] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(async () => {
    try {
      axios.defaults.headers.common["authorization"] = JSON.parse(
        localStorage.getItem("token")
      );
      const response = await axios({
        method: "post",
        url: `http://${BACKEND_HOST}:${BACKEND_PORT}/users/orders`,
        data: {
          userID: props.userData.id || (user ? user.id : 100)
        }
      });
      if (response.status == 200) {
        setOrders(() => response.data);
        setFilterOrders(() => response.data);
      } else {
        throw new Error("Error getting the orders");
      }
    } catch (e) {
      console.log(e);
      Swal2.fire({
        icon: "error",
        title: "Oops...",
        text: e
      });
    }
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deliveryOptions = {
    orderReceived: "Order Received",
    preparing: "Preparing",
    onTheWay: "On the Way",
    delivered: "Delivered"
  };
  const pickUpOptions = {
    orderReceived: "Order Received",
    preparing: "Preparing",
    pickUpReady: "Pick Up Ready",
    pickedUp: "Picked Up"
  };

  const handleFilterChange = selected => {
    setOptionSelected(() => selected);
    if (selected.length > 0) {
      setFilterOrders(() => {
        return orders.filter(prev => {
          for (let i = 0; i < selected.length; i++) {
            if (selected[i].value == prev.deliveryStatus) {
              return true;
            }
          }
        });
      });
    } else {
      setFilterOrders(() => orders);
    }
  };

  const viewCustomer = order => {
    Swal(<Test order={order} />);
  };

  return (
    <main className="TRestaurant-pageU">
      <Container>
        <main className="TdMain">
          <h3>Filter orders based on order status:</h3>
          <div
            className="filter"
            data-toggle="popover"
            data-trigger="focus"
            data-content="Please select a category"
          >
            <ReactSelect
              options={OrderDeliveryTypes}
              isMulti
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={{
                Option
              }}
              onChange={handleFilterChange}
              allowSelectAll={true}
              default={"ALL"}
              value={optionSelected}
            />
          </div>
          <br />
          <Table className="TdMain">
            <TableBody>
              {filterOrders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order, index) => {
                  let total = 0;
                  order.description &&
                    JSON.parse(order.description).map(basketOrder => {
                      total += basketOrder.count;
                      return false;
                    });
                  return (
                    <TableRow
                      key={index}
                      onClick={() => viewCustomer(order)}
                      style={{ cursor: "pointer" }}
                    >
                      <TableCell className="px-01">
                        <h2>{order.name}</h2>
                        <p>
                          {" "}
                          {total} items for ${order.totalCost} on{" "}
                          {order.dateTime}
                        </p>
                        <u>View receipt</u>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>

          <TablePagination
            className="px-4"
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filterOrders.length}
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
        </main>
      </Container>
    </main>
  );
};

function mapStateToProps(globalState) {
  return {
    userData: globalState.user
  };
}

export default connect(
  mapStateToProps,
  null
)(UserOrders);
