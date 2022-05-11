import { HttpParams } from '@angular/common/http';

export const getParamsFromArray = (array: string[], queryName: string): HttpParams => {
  let params = new HttpParams();
  if (!array || array.length === 0) return params;

  params = params.append(queryName, array.join(';'));
  return params;
};
