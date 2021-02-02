export const actions = {
  SET_ALL_ORDERS: "SET_ALL_ORDERS",
  SET_ORDER_LOADER: "SET_ORDER_LOADER",
};

export const setOrderData = (data) => ({
  type: actions.SET_ALL_ORDERS,
  data,
});

export const setOrderLoader = (
  data: boolean
): { type: string, data: boolean } => ({
  type: actions.SET_ORDER_LOADER,
  data,
});
