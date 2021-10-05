import { SET_USER_TOKEN, REMOVE_USER_TOKEN } from "./constants";

export function setToken(data) {
  return {
    type: SET_USER_TOKEN,
    payload: data
  };
}

export function removeToken() {
  return {
    type: REMOVE_USER_TOKEN
  };
}

let initialState = "";

export default function tokenReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER_TOKEN:
      return action.payload;
    case REMOVE_USER_TOKEN:
      return "";
    default:
      return state;
  }
}
