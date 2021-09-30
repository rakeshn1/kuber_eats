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
import Option from "../DropDown/Option";

function RestaurantDashboard(props) {
  const imageUploader = React.useRef(null);

  const [restaurantMenu, setRestaurantMenu] = useState({});
  const [edit, setEdit] = useState(false);
  const [optionSelected, setOptionSelected] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `http://${BACKEND_HOST}:${BACKEND_PORT}/restaurants/${props.restaurantData.id}` //${this.state.id}`
      );
      const loadedRestaurant = await response.json();
      setRestaurantMenu(() => loadedRestaurant);
    })();
  }, []);

  const handleClick = async event => {
    try {
      event.preventDefault();
      let categoriesToSend;
      if (optionSelected.length > 0) {
        categoriesToSend = optionSelected;
      } else {
        categoriesToSend = props.restaurantData.categories;
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
        categories: categoriesToSend
      };
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
                  alt={"User1"}
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
                <div className="PSearch">
                  <input
                    type="text"
                    name="email"
                    className="PSearch__text"
                    placeholder="Email"
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
                <div className="PSearch">
                  <input
                    type="number"
                    name="publicContact"
                    className="PSearch__text"
                    placeholder="Phone number"
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
                      props.restaurantData &&
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
                      props.restaurantData &&
                      props.restaurantData.timings.split("-")[1]
                    }
                    id={"search"}
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
