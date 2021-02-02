// action types.
export const actions = {
  SET_ADMIN_DATA: "SET_ADMIN_DATA",
  SET_ALL_USERS: "SET_ALL_USERS",
  SET_USER_LOADER: "SET_USER_LOADER",
};

// set complete user data to redux.
export const setAdminData = (data) => ({ type: actions.SET_ADMIN_DATA, data });

// set complete user data to redux.
export const setAllUsers = (data) => ({
  type: actions.SET_ALL_USERS,
  data,
});

// Set's user loader.
export const setUserLoader = (
  data: boolean
): { type: string, data: boolean } => ({
  type: actions.SET_USER_LOADER,
  data,
});

// Set's current user in redux.
export const setCurrentUser = (data: {}): { type: string, data: any } => ({
  type: actions.SET_CURRENT_USER,
  data,
});
