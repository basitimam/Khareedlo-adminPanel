import { actions } from "../../actions/product.action";

// Initial State
const INITIAL_STATE = {
  allproducts: null,
  loading: false,
};

// User Reducer.
export default (state = INITIAL_STATE, { type, data }) => {
  switch (type) {
    case actions.SET_ALL_PRODUCTS:
      return { ...state, allproducts: data };
    case actions.SET_PRODUCT_LOADER:
      return { ...state, loading: data };
    default:
      return state;
  }
};
