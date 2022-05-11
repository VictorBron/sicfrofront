export const addElementSets = <T>(bag: Set<T>, value: T, key: string): Set<T> => {
  let found: boolean = false;
  bag.forEach(item => {
    if (item[key as keyof typeof item] === value[key as keyof typeof value]) {
      found = true;
      return;
    }
  });
  if (!found) bag.add(value);
  return bag;
};
