export const isEmpty = val => val == null || !(Object.keys(val) || val).length;
export const nonnull = (o = {}) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => !!v));
