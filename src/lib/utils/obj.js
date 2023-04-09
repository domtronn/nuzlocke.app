export const isEmpty = val => val == null || !(Object.keys(val) || val).length;
export const nonnull = (o = {}) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => !!v));

export const toObj = (arr = [], key = 'id') => arr.reduce((acc, it) => ({ ...acc, [it[key]]: it }), {})
