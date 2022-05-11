export const copyDeepObject = (oldObj: any): any => {
  const newObj: any = Array.isArray(oldObj) ? [] : {};

  for (const i in oldObj) {
    if (typeof oldObj[i] === 'object') {
      newObj[i] = copyDeepObject(oldObj[i]);
    } else {
      newObj[i] = oldObj[i];
    }
  }
  return newObj;
};
