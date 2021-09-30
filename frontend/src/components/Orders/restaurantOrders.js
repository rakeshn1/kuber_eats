import React from "react";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
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
import * as MdIcons from "react-icons/md";
import { removeUser, setUser } from "../../redux/user";
import { default as ReactSelect } from "react-select";
import { OrderTypes } from "../DropDown/OrderTypes";
import {
  allDeliveryTypes,
  allDeliveryStatus,
  allOrderStatus
} from "../DropDown/CommonDropDownOptions";
import Option from "../DropDown/Option";
import Test from "./modal";

const PaginationTable = props => {
  const history = useHistory();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [orders, setOrders] = useState([]);
  const [filterOrders, setFilterOrders] = useState([]);
  const [optionSelected, setOptionSelected] = useState([]);
  const restaurant = JSON.parse(localStorage.getItem("restaurant"));

  useEffect(async () => {
    try {
      const response = await axios({
        method: "post",
        url: `http://${BACKEND_HOST}:${BACKEND_PORT}/restaurants/orders`,
        data: {
          restaurantID:
            props.restaurantData.id || (restaurant ? restaurant.id : 100)
        }
      });
      if (response.status == 200) {
        props.removerUser();
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

  const editStatus = (description, options, orderId) => {
    Swal2.fire({
      title: "Update status",
      input: "select",
      inputOptions: options,
      inputPlaceholder: "Update the status of the order",
      showCancelButton: true,
      confirmButtonText: "Update",
      confirmButtonColor: "#57b846",
      showLoaderOnConfirm: true,
      inputValidator: value => {
        return new Promise(resolve => {
          if (value) {
            resolve();
          } else {
            resolve("Select an option to update");
          }
        });
      },
      preConfirm: status => {
        return axios({
          method: "put",
          url: `http://${BACKEND_HOST}:${BACKEND_PORT}/restaurants/orderUpdate`,
          data: {
            deliveryStatus: status,
            id: orderId
          }
        })
          .then(response => {
            if (response.status !== 200) {
              throw new Error(response.statusText);
            }
            setOrders(prevState => {
              const newState = prevState.map(prev => {
                if (prev.id === orderId) {
                  prev.deliveryStatus = status;
                }
                return prev;
              });
              return newState;
            });
            return response.data;
          })
          .catch(error => {
            Swal2.showValidationMessage(`Update failed: ${error}`);
          });
      },
      allowOutsideClick: () => !Swal2.isLoading()
    });
  };

  const viewCustomer = order => {
    let userData = {
      id: order.id,
      name: order.name,
      nickname: order.nickname,
      email: order.email,
      dob: order.dob,
      number: order.number,
      imageUrl: order.imageUrl,
      address: order.address
    };
    props.setUser(userData);
    history.push("/userProfile");
  };

  const handleFilterChange = selected => {
    setOptionSelected(() => selected);
    if (selected.length > 0) {
      setFilterOrders(() => {
        return orders.filter(prev => {
          for (let i = 0; i < selected.length; i++) {
            if (selected[i].value == prev.status) {
              return true;
            }
          }
        });
      });
    } else {
      setFilterOrders(() => orders);
    }
  };

  const viewCustomerOrder = order => {
    Swal(<Test order={order} restView={true} />);
  };

  return (
    <main className="TRestaurant-page">
      <Container>
        <main className="TdMain">
          <h4>Filter orders based on order status:</h4>
          <div
            className="filter"
            data-toggle="popover"
            data-trigger="focus"
            data-content="Please select a category"
          >
            <ReactSelect
              options={OrderTypes}
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
            <TableHead>
              <TableRow>
                <TableCell className="px-0">Placed By</TableCell>
                <TableCell className="px-0">Description</TableCell>
                <TableCell className="px-0">Amount</TableCell>
                <TableCell className="px-0">Order Status</TableCell>
                <TableCell className="px-0">Delivery Type</TableCell>
                <TableCell className="px-0">Delivery Status</TableCell>
                <TableCell className="px-0">Action</TableCell>
              </TableRow>
            </TableHead>
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
                    <TableRow key={index}>
                      <TableCell
                        className="px-01"
                        style={{ cursor: "pointer", color: "#159dca" }}
                        onClick={() => viewCustomer(order)}
                      >
                        {order.name}
                      </TableCell>
                      <TableCell
                        className="px-01"
                        style={{ cursor: "pointer", color: "black" }}
                        onClick={() => viewCustomerOrder(order)}
                      >
                        <p>
                          {" "}
                          {total} items ordered on {order.dateTime}
                        </p>
                        <u>View details</u>
                      </TableCell>
                      <TableCell className="px-01">
                        ${order.totalCost}
                      </TableCell>
                      <TableCell className="px-01">
                        {allOrderStatus[order.status]}
                      </TableCell>
                      <TableCell className="px-01">
                        {allDeliveryTypes[order.deliveryType]}
                      </TableCell>
                      <TableCell className="px-01">
                        {allDeliveryStatus[order.deliveryStatus]}
                      </TableCell>
                      <TableCell className="px-01">
                        <MdIcons.MdModeEdit
                          title={"Click to view details and edit the status"}
                          style={{
                            height: "20px",
                            width: "40px",
                            cursor: "pointer"
                          }}
                          onClick={() =>
                            editStatus(
                              order.description,
                              order.deliveryType &&
                                order.deliveryType.toLocaleLowerCase() ==
                                  "delivery"
                                ? deliveryOptions
                                : pickUpOptions,
                              order.id
                            )
                          }
                        ></MdIcons.MdModeEdit>
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
    restaurantData: globalState.restaurant
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUser: userData => dispatch(setUser(userData)),
    removerUser: () => dispatch(removeUser())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaginationTable);
