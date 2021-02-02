import { replace } from "react-router-redux";
import { openNotificationWithIcon } from "utils/notification";
import { setCategoryData } from "../actions/category.action";
import { setProductData } from "../actions/product.action";
import { getRequest, postRequest, putRequest } from "./verb.services";

export const setUserToLocalStorage = (user, token) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

// Fetch products from db.
export const getAllProducts = (resolve, reject) => {
  return (dispatch) => {
    return getRequest("/getproduct", null, true)
      .then(({ data }) => {
        dispatch(setProductData(data));
      })
      .then(() => {
        return getRequest("/getcategory", null, false).then(({ data }) => {
          dispatch(setCategoryData(data));
          resolve();
        });
      })
      .catch(() => {
        openNotificationWithIcon("error", "Error!", "Something went wrong.");
        reject();
      });
  };
};

// Add product to db.
export const addProduct = (data, resolve, reject) => {
  return (dispatch) => {
    return postRequest("/addproduct", null, true, data)
      .then(({ data }) => {
        return getRequest("/getproduct", null, true).then(({ data }) => {
          dispatch(setProductData(data));
          resolve();
        });
      })
      .catch((error) => {
        openNotificationWithIcon("error", "Error!", "Something went wrong");
        reject();
      });
  };
};

// delete product from db.
export const deleteProduct = (record, resolve, reject) => {
  return (dispatch) => {
    return postRequest("/deleteproduct", null, true, record)
      .then(() => {
        return getRequest("/getproduct", null, true).then(({ data }) => {
          dispatch(setProductData(data));
          resolve();
        });
      })
      .catch((error) => {
        openNotificationWithIcon("error", "Error!", "Something went wrong");
        alert(error);
        reject();
      });
  };
};

export const updateProduct = (record, resolve, reject) => {
  return (dispatch, getState) => {
    return putRequest("/updateproduct", null, true, record)
      .then(() => {
        return getRequest("/getproduct", null, true).then(({ data }) => {
          dispatch(setProductData(data));
          resolve();
        });
      })
      .catch((error) => {
        openNotificationWithIcon("error", "Error!", "Something went wrong");
        alert(error);
        reject();
      });
  };
};
