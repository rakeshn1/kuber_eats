import React, { useState, useEffect } from "react";
import "./RestaurantDashboard.css";
import { default as ReactSelect } from "react-select";
import DashboardPreview from "./DashboardPreview";
import * as MdIcons from "react-icons/md";
import Allcountries from "../countries.json";
import axios from "axios";
import Swal from "sweetalert2";
import { setRestaurant, setRestaurantImageUrl } from "../../redux/restaurant";
import { connect } from "react-redux";
import { Container } from "../../Container/Container";
import { BACKEND_HOST, BACKEND_PORT } from "../../config";
import { CuisineOptions } from "../DropDown/CuisineOptions";
import { DeliveryTypes } from "../DropDown/DeliveryTypes";
import { DietaryTypes } from "../DropDown/DietaryTypes";
import Option from "../DropDown/Option";

function RestaurantDashboard(props) {
  const imageUploader = React.useRef(null);

  const [restaurantMenu, setRestaurantMenu] = useState({});
  const [edit, setEdit] = useState(false);
  const [optionSelected, setOptionSelected] = useState([]);
  const [deliveryOptionSelected, setDeliveryOptionSelected] = useState([]);
  const [dietaryOptionSelected, setDietaryOptionSelected] = useState([]);
  const initState = {
    email: "",
    publicContact: ""
  };
  const [error, setError] = useState(initState);
  const cachedData = JSON.parse(localStorage.getItem("restaurant"));

  useEffect(() => {
    (async () => {
      try {
        axios.defaults.headers.common["authorization"] = JSON.parse(
          localStorage.getItem("token")
        );
        const response = await axios({
          method: "get",
          url: `http://${BACKEND_HOST}:${BACKEND_PORT}/restaurants/${
            props.restaurantData.id ? props.restaurantData.id : cachedData.id
          }` //${this.state.id}`
        });
        const loadedRestaurant = await response.data;
        setRestaurantMenu(() => loadedRestaurant);
      } catch (e) {
        console.log(e);
        if (e.response && e.response.status === 401) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Unauthorized to access API"
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: e
          });
        }
      }
    })();
  }, []);

  const handleClick = async event => {
    try {
      event.preventDefault();
      if (formValid(error)) {
        let categoriesToSend;
        let deliveryToSend;
        let dietaryToSend;
        if (optionSelected.length > 0) {
          categoriesToSend = optionSelected;
        } else {
          categoriesToSend = props.restaurantData.categories;
        }
        if (deliveryOptionSelected.length > 0) {
          deliveryToSend = deliveryOptionSelected;
        } else {
          deliveryToSend = props.restaurantData.deliveryType;
        }
        if (dietaryOptionSelected.length > 0) {
          dietaryToSend = dietaryOptionSelected;
        } else {
          dietaryToSend = props.restaurantData.dietary;
        }
        let updatedData = {
          id: props.restaurantData.id,
          title: event.target.title.value,
          email: event.target.email.value,
          publicContact: event.target.publicContact.value,
          imageUrl: props.restaurantData.imageUrl,
          largeImageUrl: props.restaurantData.largeImageUrl,
          location: event.target.location.value,
          timings: event.target.time1.value + "-" + event.target.time2.value,
          categories: categoriesToSend,
          deliveryType: deliveryToSend,
          dietary: dietaryToSend
        };
        axios.defaults.headers.common["authorization"] = JSON.parse(
          localStorage.getItem("token")
        );
        const response = await axios({
          method: "put",
          url: `http://${BACKEND_HOST}:${BACKEND_PORT}/restaurants/update`,
          data: updatedData
        });
        if (response.status == 200) {
          Swal.fire("Successfully saved the data", "", "success");
          localStorage.setItem("restaurant", JSON.stringify(updatedData));
          props.setRestaurant(updatedData);
          setEdit(() => false);
        } else {
          throw new Error(response.data.msg);
        }
      } else {
        Swal.fire({
          title: "Please enter all the values in required format",
          confirmButtonColor: "black"
        });
      }
    } catch (e) {
      console.log(e);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: e
      });
    }
  };

  const handleImageUpload = async event => {
    try {
      //event.preventDefault();
      const [file] = event.target.files;
      if (file) {
        let bodyFormData = new FormData();
        bodyFormData.append("image", file);
        const response = await axios({
          method: "post",
          url: `http://${BACKEND_HOST}:${BACKEND_PORT}/users/uploadImage`,
          data: bodyFormData,
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (response.status == 200) {
          props.setRestaurantImageUrl(response.data.imageUrl);
        } else {
          throw new Error(response.data.msg);
        }
      }
    } catch (e) {
      console.log(e);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error:" + e
      });
    }
  };

  const handleChange = selected => {
    setOptionSelected(() => selected);
  };

  const handleDeliveryChange = selected => {
    setDeliveryOptionSelected(() => selected);
  };

  const handleDietaryChange = selected => {
    setDietaryOptionSelected(() => selected);
  };

  const handleEdit = () => {
    setEdit(() => true);
    window.scrollTo(0, 0);
  };

  const isNotEmpty = obj => {
    for (let key in obj) {
      return true;
    }
    return false;
  };

  const selectValues = () => {
    if (optionSelected.length > 0) {
      return optionSelected;
    } else {
      return props.restaurantData.categories;
    }
  };

  const selectDeliveryValues = () => {
    if (deliveryOptionSelected.length > 0) {
      return deliveryOptionSelected;
    } else {
      return props.restaurantData.deliveryType;
    }
  };

  const selectDietaryValues = () => {
    if (dietaryOptionSelected.length > 0) {
      return dietaryOptionSelected;
    } else {
      return props.restaurantData.dietary;
    }
  };

  const formValid = error => {
    const values = Object.values(error);
    for (let i = 0; i < values.length; i++) {
      if (values[i].length > 0) {
        return false;
      }
    }
    return true;
  };

  const formValChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    let newError = { ...error };

    switch (name) {
      case "email":
        newError.email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        )
          ? ""
          : "Enter a valid email address";
        break;
      case "publicContact":
        newError.publicContact =
          JSON.stringify(value).match(/\d/g).length === 10 &&
          /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g.test(value)
            ? ""
            : "Enter a 10 digit phone number";
        break;
      default:
        break;
    }

    setError(() => {
      return newError;
    });
  };

  return (
    <main className="RRestaurant-page">
      {isNotEmpty(restaurantMenu) ? (
        <DashboardPreview edit={edit} restaurantMenu={restaurantMenu} />
      ) : (
        ""
      )}
      <Container>
        <main className="RdMain">
          <p className="PMain__city">Restaurant Profile</p>
          <div className="PMain__restaurants-list">
            <div className="PRestaurants-choose">
              <form
                className="Prestaurants-choose__header"
                onSubmit={handleClick}
              >
                <p className="Pidentifiers">Restaurant display image</p>
                <img
                  src={props.restaurantData && props.restaurantData.imageUrl}
                  className="RdRestaurants-choose__photo"
                  alt={"Restaurant Photo"}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={imageUploader}
                  value=""
                  style={{
                    display: "none"
                  }}
                />
                {edit && (
                  <MdIcons.MdModeEdit
                    style={{ height: "30px", width: "50px", cursor: "pointer" }}
                    onClick={() => imageUploader.current.click()}
                  ></MdIcons.MdModeEdit>
                )}
                <br />
                <p className="Pidentifiers">Name</p>
                <div className="PSearch">
                  <input
                    type="text"
                    name="title"
                    className="PSearch__text"
                    placeholder="Title"
                    disabled={!edit}
                    defaultValue={
                      props.restaurantData && props.restaurantData.title
                    }
                    id={"search"}
                  />
                </div>
                <br />
                <p className="Pidentifiers">Email</p>
                {error.email.length > 0 && (
                  <>
                    {" "}
                    <span className="invalid-feedback">{error.email}</span>
                  </>
                )}
                <div className="PSearch">
                  <input
                    type="text"
                    name="email"
                    className="PSearch__text"
                    placeholder="Email"
                    onChange={formValChange}
                    disabled={!edit}
                    defaultValue={
                      props.restaurantData && props.restaurantData.email
                    }
                    id={"search"}
                  />
                </div>
                <br />
                <p className="Pidentifiers">Location</p>
                <div className="PSearch">
                  <input
                    type="text"
                    name="location"
                    className="PSearch__text"
                    placeholder="Location"
                    disabled={!edit}
                    defaultValue={
                      props.restaurantData && props.restaurantData.location
                    }
                    id={"search"}
                  />
                </div>
                <br />
                <p className="Pidentifiers">Phone number</p>
                {error.publicContact.length > 0 && (
                  <>
                    {" "}
                    <span className="invalid-feedback">
                      {error.publicContact}
                    </span>
                  </>
                )}
                <div className="PSearch">
                  <input
                    type="number"
                    name="publicContact"
                    className="PSearch__text"
                    placeholder="Phone number"
                    onChange={formValChange}
                    disabled={!edit}
                    defaultValue={
                      props.restaurantData && props.restaurantData.publicContact
                    }
                    id={"search"}
                  />
                </div>
                <br />
                <p className="Pidentifiers">Restaurant timings</p>
                <div className="PSearch">
                  <input
                    type="time"
                    name="time1"
                    className="PSearch__text"
                    placeholder="DOB"
                    disabled={!edit}
                    defaultValue={
                      props.restaurantData.timings &&
                      props.restaurantData.timings.split("-")[0]
                    }
                    id={"search"}
                  />
                  <span style={{ fontSize: "22px", paddingLeft: "25px" }}>
                    To
                  </span>
                  <input
                    type="time"
                    name="time2"
                    className="PSearch__text"
                    placeholder="DOB"
                    disabled={!edit}
                    defaultValue={
                      props.restaurantData.timings &&
                      props.restaurantData.timings.split("-")[1]
                    }
                    id={"search"}
                  />
                </div>
                <br />
                <p className="Pidentifiers">Dietary Type</p>
                <div
                  className="PSearch"
                  data-toggle="popover"
                  data-trigger="focus"
                  data-content="Please select Dietary Type(s)"
                >
                  <ReactSelect
                    options={DietaryTypes}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    disabled={!edit}
                    components={{
                      Option
                    }}
                    onChange={handleDietaryChange}
                    allowSelectAll={true}
                    value={selectDietaryValues()}
                  />
                </div>
                <br />
                <p className="Pidentifiers">Cuisine</p>
                <div
                  className="PSearch"
                  data-toggle="popover"
                  data-trigger="focus"
                  data-content="Please select Cuisine(s)"
                >
                  <ReactSelect
                    options={CuisineOptions}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    disabled={!edit}
                    components={{
                      Option
                    }}
                    onChange={handleChange}
                    allowSelectAll={true}
                    value={selectValues()}
                  />
                </div>
                <br />
                <p className="Pidentifiers">Delivery Type</p>
                <div
                  className="PSearch"
                  data-toggle="popover"
                  data-trigger="focus"
                  data-content="Please select Delivery Type(s)"
                >
                  <ReactSelect
                    options={DeliveryTypes}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    disabled={!edit}
                    components={{
                      Option
                    }}
                    onChange={handleDeliveryChange}
                    allowSelectAll={true}
                    value={selectDeliveryValues()}
                  />
                </div>
                <br />
                {edit && (
                  <div className="Pcontainer-login100-form-btn">
                    <button className="Plogin100-form-btn">Save</button>
                  </div>
                )}
              </form>
              {!edit && (
                <div className="Pcontainer-login100-form-btn">
                  <button className="Plogin100-form-btn" onClick={handleEdit}>
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </Container>
    </main>
  );
}

function mapStateToProps(globalState) {
  return {
    restaurantData: globalState.restaurant
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setRestaurantImageUrl: url => dispatch(setRestaurantImageUrl(url)),
    setRestaurant: restaurantData => dispatch(setRestaurant(restaurantData))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RestaurantDashboard);
