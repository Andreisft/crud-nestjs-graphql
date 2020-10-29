export const removeUndefinedFromObject = <T extends Object>(obj: T) => {
  Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key]);
  const newObj = obj;
  return newObj;
};
