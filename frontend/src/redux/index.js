import redux, {createStore, combineReducers, compose} from "redux"
import userReducer from "./user";

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
    user : userReducer
})

const store = createStore(
    rootReducer,
    storeEnhancers()
);
export default store