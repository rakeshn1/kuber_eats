import { SET_IS_RESTAURANT_LOGGED_IN } from "./constants";
import { REMOVE_IS_RESTAURANT_LOGGED_IN } from "./constants";

export function setIsUserLoggedIn() {
  return {
    type: SET_IS_RESTAURANT_LOGGED_IN
  };
}

export function unSetIsUserLoggedIn() {
  return {
    type: REMOVE_IS_RESTAURANT_LOGGED_IN
  };
}

let isRestaurantLoggedIn = false;

export default function restaurantLoginReducer(
  state = isRestaurantLoggedIn,
  action
) {
  switch (action.type) {
    case SET_IS_RESTAURANT_LOGGED_IN:
      return true;
    case REMOVE_IS_RESTAURANT_LOGGED_IN:
      return false;
    default:
      return state;
  }
}
