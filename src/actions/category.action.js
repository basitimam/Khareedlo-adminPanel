export const actions = {
  SET_ALL_CATEGORIES: "SET_ALL_CATEGORIES",
};

export const setCategoryData = (data) => ({
  type: actions.SET_ALL_CATEGORIES,
  data,
});

export const setCategoryLoader = (
  data: boolean
): { type: string, data: boolean } => ({
  type: actions.SET_CATEGORY_LOADER,
  data,
});
