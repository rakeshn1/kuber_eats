import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import "../Profile/UserProfile.css";
import { Container } from "../../Container/Container";
import * as MdIcons from "react-icons/md";
import axios from "axios";
import Swal from "sweetalert2";
import { setImageUrl, removeDish } from "../../redux/dish";
import { default as ReactSelect } from "react-select";
import { DishCategory } from "../DropDown/DishCategory";
import Option from "../DropDown/Option";

function AddDish(props) {
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
      let updatedData = {
        id: props.dishData.id,
        title: event.target.title.value,
        ingredients: event.target.ingredients.value,
        description: event.target.description.value,
        price: event.target.price.value,
        category: event.target.category.value,
        imageUrl: props.dishData.imageUrl,
        rules: event.target.rules.value,
        customizationIds: event.target.customizationIds.value,
        restaurantID: props.dishData.restaurantID
      };
      const response = await axios({
        method: "put",
        url: "http://localhost:5676/users/update",
        data: updatedData
      });
      if (response.status == 200) {
        Swal.fire("Successfully saved the data", "", "success");
        localStorage.setItem("user", JSON.stringify(updatedData));
        props.removeDish();
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

  const handleImageUpload = async event => {
    try {
      //event.preventDefault();
      const [file] = event.target.files;
      if (file) {
        let bodyFormData = new FormData();
        bodyFormData.append("image", file);
        const response = await axios({
          method: "post",
          url: "http://localhost:5676/users/uploadImage",
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
      return props.restaurantData.categories;
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
              <MdIcons.MdModeEdit
                style={{ height: "30px", width: "50px", cursor: "pointer" }}
                onClick={() => imageUploader.current.click()}
              ></MdIcons.MdModeEdit>
              <br />
              <p className="Pidentifiers">Name</p>
              <div className="PSearch">
                <input
                  type="text"
                  name="name"
                  className="PSearch__text"
                  placeholder="Name"
                  defaultValue={props.dishData && props.dishData.name}
                  id={"search"}
                />
              </div>
              <br />
              <p className="Pidentifiers">Main Ingredients</p>
              <div className="PSearch">
                <input
                  type="text"
                  name="email"
                  className="PSearch__text"
                  placeholder="Main Ingredients"
                  defaultValue={
                    props.dishData && props.dishData.mainIngredients
                  }
                  id={"search"}
                />
              </div>
              <br />
              <p className="Pidentifiers">Description</p>
              <div className="PSearch">
                <input
                  type="text"
                  name="nickname"
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
                  name="number"
                  className="PSearch__text"
                  placeholder="Price"
                  defaultValue={props.dishData && props.dishData.price}
                  id={"search"}
                />
              </div>
              <br />
              <div
                className="PSearch"
                data-toggle="popover"
                data-trigger="focus"
                data-content="Please select Cuisine(s)"
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
                  value={optionSelected}
                />
              </div>
              <br />
              <div className="Pcontainer-login100-form-btn">
                <button className="Plogin100-form-btn">Save</button>
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
    dishData: globalState.dish
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setImage: url => dispatch(setImageUrl(url)),
    removeDish: dishData => dispatch(removeDish())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddDish);
