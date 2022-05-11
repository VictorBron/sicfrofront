export interface APIUrlObj {
  key: string;
  path: string;
  params?: {
    [key: string]: {
      key: string;
      value: string;
    };
  };
}
