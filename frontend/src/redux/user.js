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

export default function userReducer(state = null, action) {
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
