import redux, { createStore, combineReducers, compose } from "redux";
import userReducer from "./user";
import restaurantReducer from "./restaurant";
import dishReducer from "./dish";

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  user: userReducer,
  restaurant: restaurantReducer,
  dish: dishReducer
});

const store = createStore(rootReducer, storeEnhancers());
export default store;
