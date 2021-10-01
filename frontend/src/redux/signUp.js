import { SET_SIGN_UP_SUCCESS } from "./constants";
import { REMOVE_SIGN_UP_SUCCESS } from "./constants";

export function setSignUp() {
  return {
    type: SET_SIGN_UP_SUCCESS
  };
}

export function removeSignUp() {
  return {
    type: REMOVE_SIGN_UP_SUCCESS
  };
}

let initialState = "";

export default function signUpReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SIGN_UP_SUCCESS:
      return "Sign Up Successful";
    case REMOVE_SIGN_UP_SUCCESS:
      return "";
    default:
      return state;
  }
}
