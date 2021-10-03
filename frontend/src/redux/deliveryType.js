import { SET_DELIVERY_TYPE } from "./constants";

export function setDeliveryType(data) {
  return {
    type: SET_DELIVERY_TYPE,
    payload: data
  };
}

let initialState = "delivery";

export default function deliveryTypeReducer(state = initialState, action) {
  switch (action.type) {
    case SET_DELIVERY_TYPE: {
      if (state !== action.payload) {
        return action.payload;
      } else {
        return state;
      }
    }
    default:
      return state;
  }
}
