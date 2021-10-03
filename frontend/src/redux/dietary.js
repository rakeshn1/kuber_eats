import { CHANGE_DIETARY } from "./constants";

export function changeDietary(restaurantID) {
  return {
    type: CHANGE_DIETARY,
    payload: restaurantID
  };
}

let initialState = [];

export default function dietaryReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_DIETARY: {
      let updated = state;
      const index = updated.indexOf(action.payload);
      if (index > -1) {
        updated = updated.filter(value => value !== action.payload);
      } else {
        updated = updated.filter(value => true);
        updated.push(action.payload);
      }
      return updated;
    }
    default:
      return state;
  }
}
