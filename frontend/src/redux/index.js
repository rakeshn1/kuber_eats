import redux, { createStore, combineReducers, compose } from "redux";
import userReducer from "./user";
import restaurantReducer from "./restaurant";
import dishReducer from "./dish";
import userLoginReducer from "./userLogin";
import restaurantLoginReducer from "./restaurantLogin";
import signUpReducer from "./signUp";

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  user: userReducer,
  restaurant: restaurantReducer,
  dish: dishReducer,
  isUserLoggedIn: userLoginReducer,
  isRestaurantLoggedIn: restaurantLoginReducer,
  signUpMessage: signUpReducer
});

const store = createStore(rootReducer, storeEnhancers());
export default store;
