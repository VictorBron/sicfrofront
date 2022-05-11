const maxId = 10000;
const minId = 1;

export const generateRandomQueryId = (resource: string): string =>
  `${resource}?id=${Math.floor(Math.random() * (maxId - minId)) + minId}`;
