import redux, { createStore, combineReducers, compose } from "redux";
import userReducer from "./user";
import restaurantReducer from "./restaurant";

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  user: userReducer,
  restaurant: restaurantReducer
});

const store = createStore(rootReducer, storeEnhancers());
export default store;
