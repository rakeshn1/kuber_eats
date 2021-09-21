import { SET_USER } from "./constants";
import { REMOVE_USER } from "./constants";
import { SET_USER_IMAGE_URL } from "./constants";

export function setUser(data) {
  return {
    type: SET_USER,
    payload: data
  };
}

export function removeUser() {
  return {
    type: REMOVE_USER
  };
}

export function setImageUrl(url) {
  return {
    type: SET_USER_IMAGE_URL,
    payload: url
  };
}

let initialState = {
  id: "",
  name: "",
  nickname: "",
  email: "",
  dob: "",
  number: "",
  imageUrl: "",
  address: {
    addressLine: "",
    city: "",
    state: "",
    country: "",
    pinCode: ""
  }
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return action.payload;
    case REMOVE_USER:
      return null;
    case SET_USER_IMAGE_URL:
      return Object.assign({}, state, {
        imageUrl: action.payload
      });
    default:
      return state;
  }
}
