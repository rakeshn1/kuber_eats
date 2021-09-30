import React from "react";
import "./RestaurantDashboard.css";
import { setRestaurantLargeImageUrl } from "../../redux/restaurant";
import axios from "axios";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import { BACKEND_HOST, BACKEND_PORT } from "../../config";
import * as MdIcons from "react-icons/md";

function DashboardPreview(props) {
  const imageUploader = React.useRef(null);
  const restaurantMenu = props.restaurantMenu;

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
          props.setLargeImageUrl(response.data.imageUrl);
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

  return (
    <div>
      <section className="RRestaurant-preview__background">
        <img
          src={props.restaurantData.largeImageUrl}
          alt=""
          className={"RRestaurant-preview__back"}
        />
        <div className="RRestaurant-preview__wrapper">
          <div className="Rrestaurant-preview Restaurant-preview">
            <span className="RRestaurant-preview__name Restaurant-preview__name">
              {props.restaurantData.title}
            </span>
          </div>
        </div>
      </section>
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
      {props.edit && (
        <MdIcons.MdModeEdit
          style={{
            height: "30px",
            width: "50px",
            cursor: "pointer",
            float: "right"
          }}
          onClick={() => imageUploader.current.click()}
        ></MdIcons.MdModeEdit>
      )}
    </div>
  );
}

function mapStateToProps(globalState) {
  return {
    restaurantData: globalState.restaurant
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setLargeImageUrl: url => dispatch(setRestaurantLargeImageUrl(url))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardPreview);
