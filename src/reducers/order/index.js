import { actions } from "../../actions/order.action";

// Initial State
const INITIAL_STATE = {
  allorders: null,
  loading: false,
};

// User Reducer.
export default (state = INITIAL_STATE, { type, data }) => {
  switch (type) {
    case actions.SET_ALL_ORDERS:
      return { ...state, allorders: data };
    case actions.SET_ORDER_LOADER:
      return { ...state, loading: data };
    default:
      return state;
  }
};
