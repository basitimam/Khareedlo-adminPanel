import { replace } from "react-router-redux";
import { openNotificationWithIcon } from "utils/notification";
import { setUser, setAllUsers } from "actions/user.action";
import { login, getUsers } from "mockApi/user/controller";
import { setAdminData } from "../actions/user.action";
import { getRequest, postRequest, putRequest } from "./verb.services";

export const setUserToLocalStorage = (user, token) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

// performs user authentication.
export const userLogin = (data, resolve, reject) => {
  return (dispatch) => {
    return postRequest("admin/signin", null, false, data)
      .then(({ data, status }) => {
        if (status === 200) {
          const userData = data.user;
          setUserToLocalStorage(userData, data.token);
          dispatch(
            setAdminData({
              ...userData,
            })
          );
          dispatch(replace("/dashboard/users"));
          resolve();
        } else {
          // Notify Error
          openNotificationWithIcon(
            "error",
            "Something went wrong. Internet problem maybe?"
          );
          reject();
        }
      })
      .catch((error) => {
        const err =
          error && error.response && error.response.data
            ? error.response.data.message
            : "Something went wrong";
        // Notify Error
        openNotificationWithIcon(
          "error",
          "Something went wrong. Internet problem maybe?",
          err
        );
        reject();
      });
  };
};

export const logout = () => {
  return (dispatch) => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch(setAdminData(null));
    setTimeout(() => {
      window.location = "/";
    }, 500);
  };
};

// Fetch users from db.
export const getAllUsers = (resolve, reject) => {
  return (dispatch) => {
    return getRequest("/admin/getusers", null, true)
      .then(({ data }) => {
        dispatch(setAllUsers(data));
        console.log(data);
        resolve();
      })
      .catch(() => {
        openNotificationWithIcon("error", "Error!", "Something went wrong.");
        reject();
      });
  };
};
