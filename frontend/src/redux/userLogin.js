import { SET_IS_USER_LOGGED_IN } from "./constants";
import { REMOVE_IS_USER_LOGGED_IN } from "./constants";

export function setIsUserLoggedIn() {
  return {
    type: SET_IS_USER_LOGGED_IN
  };
}

export function unSetIsUserLoggedIn() {
  return {
    type: REMOVE_IS_USER_LOGGED_IN
  };
}

let isUserLoggedIn = false;

export default function userLoginReducer(state = isUserLoggedIn, action) {
  switch (action.type) {
    case SET_IS_USER_LOGGED_IN:
      return true;
    case REMOVE_IS_USER_LOGGED_IN:
      return false;
    default:
      return state;
  }
}
