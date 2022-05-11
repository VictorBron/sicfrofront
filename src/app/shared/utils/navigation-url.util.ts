export const getNavigationUrl = (
  url: string,
  params: {
    [key: string]: string | number;
  },
): string => {
  Object.keys(params).forEach(key => {
    const value = typeof params[key] === 'number' ? params[key].toString() : (params[key] as string);
    url = url.replace(key, value);
  });

  return url;
};
