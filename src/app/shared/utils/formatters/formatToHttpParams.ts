import { HttpParams } from '@angular/common/http';

/**
 * Method to loop over all object keys and add its value as http param
 *
 * @param queryParams
 */
export const generateQueryParamsFromObject = <T>(queryParams: T): HttpParams => {
  let params = new HttpParams();

  Object.entries(queryParams).forEach(([key, value]) => {
    params = params.append(key, String(value));
  });

  return params;
};
