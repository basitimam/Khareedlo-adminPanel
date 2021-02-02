import { openNotificationWithIcon } from "utils/notification";
import { setCategoryData } from "../actions/category.action";
import { getRequest } from "./verb.services";

// Fetch categories from db.
export const getAllCategories = (resolve, reject) => {
  return (dispatch) => {
    return getRequest("/getcategory", null, false)
      .then(({ data }) => {
        dispatch(setCategoryData(data));
        resolve();
      })
      .catch(() => {
        openNotificationWithIcon("error", "Error!", "Something went wrong.");
        reject();
      });
  };
};
