import { actions } from "../../actions/category.action";

// Initial State
const INITIAL_STATE = {
  allCategories: null,
};

// User Reducer.
export default (state = INITIAL_STATE, { type, data }) => {
  switch (type) {
    case actions.SET_ALL_CATEGORIES:
      return { ...state, allCategories: data };
    default:
      return state;
  }
};
