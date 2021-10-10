import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import "../Profile/UserProfile.css";
import { Container } from "../../Container/Container";
import * as MdIcons from "react-icons/md";
import axios from "axios";
import Swal from "sweetalert2";
import { setImageUrl, setDish } from "../../redux/dish";
import { default as ReactSelect } from "react-select";
import { DishCategory } from "../DropDown/DishCategory";
import Option from "../DropDown/Option";
import { BACKEND_HOST } from "../../config";
import { BACKEND_PORT } from "../../config";
import { useHistory } from "react-router-dom";

function AddDish(props) {
  const history = useHistory();
  let initialState = {
    id: "",
    title: "",
    imageUrl: "",
    ingredients: "",
    description: "",
    price: "",
    category: "",
    rules: "",
    customizationIds: "",
    restaurantID: ""
  };
  const imageUploader = React.useRef(null);
  const [edit, setEdit] = useState(false);
  const [optionSelected, setOptionSelected] = useState([]);

  useEffect(() => {
    if (props.dishData.id) {
      setEdit(() => true);
    }
  }, []);

  async function handleClick(event) {
    try {
      event.preventDefault();
      if (
        event.target.title.value.length <= 0 ||
        event.target.ingredients.value.length <= 0 ||
        event.target.description.value.length <= 0 ||
        event.target.price.value <= 0
      ) {
        Swal.fire({
          title: "Please enter all the values in required format",
          confirmButtonColor: "black"
        });
      } else {
        if (edit) {
          let categoriesToSend;
          if (optionSelected.length > 0) {
            categoriesToSend = optionSelected;
          } else {
            categoriesToSend = props.dishData.category;
          }
          let updatedData = {
            id: props.dishData.id,
            title: event.target.title.value,
            ingredients: event.target.ingredients.value,
            description: event.target.description.value,
            price: event.target.price.value,
            category: categoriesToSend,
            imageUrl: props.dishData.imageUrl,
            rules: props.dishData.rules,
            customizationIds: props.dishData.customizationIds,
            restaurantID: props.restaurantData.id
          };
          axios.defaults.headers.common["authorization"] = JSON.parse(
            localStorage.getItem("token")
          );
          const response = await axios({
            method: "put",
            url: `http://${BACKEND_HOST}:${BACKEND_PORT}/restaurants/editDish`,
            data: updatedData
          });
          if (response.status == 200) {
            Swal.fire("Successfully saved the data", "", "success");
            props.setDish(initialState);
            history.push("/dishes");
          } else {
            throw new Error(response.data.msg);
          }
        } else {
          let updatedData = {
            title: event.target.title.value,
            ingredients: event.target.ingredients.value,
            description: event.target.description.value,
            price: event.target.price.value,
            category: optionSelected,
            imageUrl: props.dishData.imageUrl,
            // rules: props.dishData.rules.value,
            // customizationIds: event.target.customizationIds.value,
            restaurantID: props.restaurantData.id
          };
          axios.defaults.headers.common["authorization"] = JSON.parse(
            localStorage.getItem("token")
          );
          const response = await axios({
            method: "post",
            url: `http://${BACKEND_HOST}:${BACKEND_PORT}/restaurants/addDish`,
            data: updatedData
          });
          if (response.status == 200) {
            Swal.fire("Successfully saved the data", "", "success");
            localStorage.setItem("user", JSON.stringify(updatedData));
            props.setDish(initialState);
            history.push("/dishes");
          } else {
            throw new Error(response.data.msg);
          }
        }
      }
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
  }

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
          props.setImage(response.data.imageUrl);
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

  const selectValues = () => {
    if (optionSelected.length > 0) {
      return optionSelected;
    } else {
      return props.dishData.category;
    }
  };

  const handleEdit = () => {
    setEdit(() => true);
    window.scrollTo(0, 0);
  };

  return (
    <Container>
      <main className="PMain">
        <p className="PMain__city">Add/Edit Dish</p>
        <div className="PMain__restaurants-list">
          <div className="PRestaurants-choose">
            <form
              className="Prestaurants-choose__header"
              onSubmit={handleClick}
            >
              <img
                src={props.dishData && props.dishData.imageUrl}
                className="PRestaurants-choose__photo"
                alt={"Dish image"}
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
              <MdIcons.MdModeEdit
                style={{ height: "30px", width: "50px", cursor: "pointer" }}
                onClick={() => imageUploader.current.click()}
              ></MdIcons.MdModeEdit>
              <br />
              <p className="Pidentifiers">Name</p>
              <div className="PSearch">
                <input
                  type="text"
                  name="title"
                  className="PSearch__text"
                  placeholder="Name"
                  defaultValue={props.dishData && props.dishData.title}
                  id={"search"}
                />
              </div>
              <br />
              <p className="Pidentifiers">Main Ingredients</p>
              <div className="PSearch">
                <input
                  type="text"
                  name="ingredients"
                  className="PSearch__text"
                  placeholder="Main Ingredients"
                  defaultValue={props.dishData && props.dishData.ingredients}
                  id={"search"}
                />
              </div>
              <br />
              <p className="Pidentifiers">Description</p>
              <div className="PSearch">
                <input
                  type="text"
                  name="description"
                  className="PSearch__text"
                  placeholder="Description"
                  defaultValue={props.dishData && props.dishData.description}
                  id={"search"}
                />
              </div>
              <br />
              <p className="Pidentifiers">Price</p>
              <div className="PSearch">
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  className="PSearch__text"
                  placeholder="Price"
                  defaultValue={props.dishData && props.dishData.price}
                  id={"search"}
                />
              </div>
              <br />
              <p className="Pidentifiers">Dish Category</p>
              <div
                className="PSearch"
                data-toggle="popover"
                data-trigger="focus"
                data-content="Please select a category"
              >
                <ReactSelect
                  options={DishCategory}
                  isMulti
                  closeMenuOnSelect={true}
                  hideSelectedOptions={false}
                  components={{
                    Option
                  }}
                  onChange={handleChange}
                  allowSelectAll={false}
                  value={selectValues()}
                />
              </div>
              <br />
              <div className="Pcontainer-login100-form-btn">
                <button className="Plogin100-form-btn">
                  {edit ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </Container>
  );
}

function mapStateToProps(globalState) {
  return {
    dishData: globalState.dish,
    restaurantData: globalState.restaurant
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setImage: url => dispatch(setImageUrl(url)),
    setDish: dishData => dispatch(setDish(dishData))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddDish);
