import { SET_DISH } from "./constants";
import { REMOVE_DISH } from "./constants";
import { SET_DISH_IMAGE_URL } from "./constants";

export function setDish(data) {
  return {
    type: SET_DISH,
    payload: data
  };
}

export function removeDish() {
  return {
    type: REMOVE_DISH
  };
}

export function setImageUrl(url) {
  return {
    type: SET_DISH_IMAGE_URL,
    payload: url
  };
}

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

export default function dishReducer(state = initialState, action) {
  switch (action.type) {
    case SET_DISH:
      return action.payload;
    case REMOVE_DISH:
      return null;
    case SET_DISH_IMAGE_URL:
      return Object.assign({}, state, {
        imageUrl: action.payload
      });
    default:
      return state;
  }
}
