import { SET_RESTAURANT } from "./constants";
import { REMOVE_RESTAURANT } from "./constants";
import { SET_RESTAURANT_IMAGE_URL } from "./constants";
import { SET_RESTAURANT_LARGE_IMAGE_URL } from "./constants";

export function setRestaurant(data) {
  return {
    type: SET_RESTAURANT,
    payload: data
  };
}

export function removeRestaurant() {
  return {
    type: REMOVE_RESTAURANT
  };
}

export function setRestaurantImageUrl(url) {
  return {
    type: SET_RESTAURANT_IMAGE_URL,
    payload: url
  };
}

export function setRestaurantLargeImageUrl(url) {
  return {
    type: SET_RESTAURANT_LARGE_IMAGE_URL,
    payload: url
  };
}

let initialState = {
  id: "",
  title: "",
  email: "",
  publicContact: "",
  largeImageUrl: "",
  imageUrl: "",
  location: "",
  timings: "",
  categories: []
};

export default function restaurantReducer(state = initialState, action) {
  switch (action.type) {
    case SET_RESTAURANT:
      return action.payload;
    case REMOVE_RESTAURANT:
      return null;
    case SET_RESTAURANT_IMAGE_URL:
      return Object.assign({}, state, {
        imageUrl: action.payload
      });
    case SET_RESTAURANT_LARGE_IMAGE_URL:
      return Object.assign({}, state, {
        largeImageUrl: action.payload
      });
    default:
      return state;
  }
}
