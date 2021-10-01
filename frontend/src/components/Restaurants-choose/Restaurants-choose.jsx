import React, { useState } from "react";
import "./Restaurants-choose.css";
import { Link } from "react-router-dom";
import { changeFavorite } from "../../redux/user";
import { connect } from "react-redux";
import axios from "axios";
import { BACKEND_HOST, BACKEND_PORT } from "../../config";
import Swal from "sweetalert2";

function RestaurantChoose(props) {
  const likedImageUrl = `http://${BACKEND_HOST}:${BACKEND_PORT}/images/like.png`;
  const unLikedImageUrl = `http://${BACKEND_HOST}:${BACKEND_PORT}/images/heart.png`;
  const [imageUrl, setImageUrl] = useState(unLikedImageUrl);

  const handleClick = async e => {
    e.preventDefault();
    try {
      let updatedData = {
        favorites: props.userData.favorites,
        id: props.userData.id,
        restaurantID: props.uuid
      };
      const response = await axios({
        method: "put",
        url: `http://${BACKEND_HOST}:${BACKEND_PORT}/users/updateFavorites`,
        data: updatedData
      });
      if (response.status == 200) {
        props.changeFavorite(props.uuid);
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

  return (
    <div className="Restaurants-choose">
      <Link
        to={`restaurant-page/${props.uuid}`}
        className="Restaurants-choose__link"
      >
        <div className="restaurants-choose__header">
          <img
            src={props.imageUrl}
            className="Restaurants-choose__photo"
            alt={props.title}
          />
        </div>
        {props.userData.favorites.includes(props.uuid) && (
          <img
            title={"Remove from favorites"}
            className="fa-heart"
            src={likedImageUrl}
            onClick={handleClick}
          />
        )}
        {!props.userData.favorites.includes(props.uuid) && (
          <img
            title={"Save as favorite"}
            className="fa-heart"
            src={unLikedImageUrl}
            onClick={handleClick}
          />
        )}
        <div className="restaurants-choose__footer">
          <p className="Restaurants-choose__name">{props.title}</p>
          <p className="Restaurants-choose__about">
            {props.priceBucket}{" "}
            {props.categories.map(category => {
              return ` • ${category.name}`;
            })}{" "}
          </p>
          <p className="Restaurants-choose__delivery-time">
            {props.etaRange.min} - {props.etaRange.max} min
          </p>
        </div>
      </Link>
    </div>
  );
}

function mapStateToProps(globalState) {
  return {
    userData: globalState.user,
    isUserLoggedIn: globalState.isUserLoggedIn
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeFavorite: uuid => dispatch(changeFavorite(uuid))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RestaurantChoose);
