import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import users from "./user";
import modal from "./modal";
import products from "./product/index";
import category from "./category/index";
import order from "./order/index";

// Root Reducer.
export default combineReducers({
  routing: routerReducer,
  users,
  modal,
  products,
  category,
  order,
});
