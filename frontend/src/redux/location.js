import { SET_LOCATION } from "./constants";

export function setLocation(data) {
  return {
    type: SET_LOCATION,
    payload: data
  };
}

let initialState = "";

export default function locationReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOCATION: {
      return action.payload;
    }
    default:
      return state;
  }
}
