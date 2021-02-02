import { openNotificationWithIcon } from "utils/notification";
import { setOrderData } from "actions/order.action";
import { getRequest, postRequest, putRequest } from "./verb.services";

export const setUserToLocalStorage = (user, token) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

// Fetch orders from db.
export const getAllOrders = (resolve, reject) => {
  return (dispatch) => {
    return getRequest("/getorders", null, true)
      .then(({ data }) => {
        dispatch(setOrderData(data));
        resolve();
      })
      .catch(() => {
        openNotificationWithIcon("error", "Error!", "Something went wrong.");
        reject();
      });
  };
};

// delete product from db.
export const deleteOrder = ({ _id }, resolve, reject) => {
  return (dispatch) => {
    return postRequest("/deleteorder", null, true, { _id })
      .then(() => {
        return getRequest("/getorders", null, true).then(({ data }) => {
          dispatch(setOrderData(data));
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
