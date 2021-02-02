export const actions = {
  SET_ALL_PRODUCTS: "SET_ALL_PRODUCTS",
  SET_PRODUCT_LOADER: "SET_PRODUCT_LOADER",
};

export const setProductData = (data) => ({
  type: actions.SET_ALL_PRODUCTS,
  data,
});

export const setProductLoader = (
  data: boolean
): { type: string, data: boolean } => ({
  type: actions.SET_PRODUCT_LOADER,
  data,
});
