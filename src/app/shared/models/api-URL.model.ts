export interface URLDef {
  [key: string]: {
    key: string;
    path: string;
    params?: {
      [key: string]: {
        key: string;
        value: string;
      };
    };
  };
}

export interface APIUrlInstance {
  path: string;
  params?: {
    [key: string]: {
      key: string;
      value: string;
    };
  };
}
