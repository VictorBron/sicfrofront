import { Request, RequestMassive } from '../../models';
import { VehicleDriver } from './../../models/vehicle-driver.model';
import { getTimeSpan } from '../../../../shared/utils';
import { ERRORS_REQUESTS_MASSIVE } from '.';

export const isUnique = (requestsTable: RequestMassive[], request: RequestMassive, key: string): boolean => {
  let hasErrors: boolean = false;
  let check = requestsTable.filter(req => req[key as keyof typeof req] === request[key as keyof typeof request]);
  let continueFlag: boolean = true;
  if (check.length !== 1)
    check.forEach(repeat => {
      if (repeat.IdRow !== request.IdRow) {
        if (continueFlag && repeat.comment !== ERRORS_REQUESTS_MASSIVE.NULL && sameRequest(repeat, request)) {
          continueFlag = false;
          hasErrors = true;
        }
      }
    });
  return !hasErrors;
};

export const parseRequestMassive = (requestsTable: RequestMassive[]): Request[] => {
  let requests: Request[] = [];
  let rowsDone: Set<number> = new Set<number>();
  let rowsFilter: RequestMassive[] = [];
  requestsTable.forEach(row => {
    rowsFilter = [];
    if (!rowsDone.has(row.IdRow)) {
      rowsFilter = requestsTable.filter(req => sameRequest(row, req));
      rowsFilter.forEach((match: RequestMassive) => {
        rowsDone.add(match.IdRow);
      });
      requests.push(castRequest(rowsFilter));
    }
  });

  return requests;
};

const sameRequest = (cmp1: RequestMassive, cmp2: RequestMassive): boolean => {
  return (
    cmp1.ValidityStart.toISOString() === cmp2.ValidityStart.toISOString() &&
    cmp1.ValidityEnd.toISOString() === cmp2.ValidityEnd.toISOString() &&
    cmp1.ValidityStartHour === cmp2.ValidityStartHour &&
    cmp1.ValidityEndHour === cmp2.ValidityEndHour &&
    cmp1.IndustrialShed === cmp2.IndustrialShed &&
    cmp1.DestinyClient === cmp2.DestinyClient &&
    cmp1.Product === cmp2.Product &&
    cmp1.Format === cmp2.Format &&
    cmp1.NumAgreement === cmp2.NumAgreement &&
    cmp1.NumAgris === cmp2.NumAgris &&
    cmp1.DestinyDirection === cmp2.DestinyDirection
  );
};

const castRequest = (arrayRequest: RequestMassive[]): Request => {
  const request: RequestMassive = arrayRequest[0];
  let vehicleDriver: VehicleDriver[] = [];

  vehicleDriver = arrayRequest.map((row: RequestMassive) => {
    return {
      Driver: row.Driver,
      Vehicle: row.Vehicle,
      Active: true,
    } as VehicleDriver;
  });

  let startDate: Date = request.ValidityStart;
  startDate.setHours(1, 0, 0);
  let endDate: Date = request.ValidityEnd;
  endDate.setHours(1, 0, 0);

  return {
    ValidityStart: startDate,
    ValidityEnd: endDate,
    ValidityStartHour: getTimeSpan(request.ValidityStartHour),
    ValidityEndHour: getTimeSpan(request.ValidityEndHour),
    Product: String(request.Product),
    Format: String(request.Format),
    NumAgreement: String(request.NumAgreement),
    OC: String(request.OC),
    NumAgris: String(request.NumAgris),
    DestinyClient: String(request.DestinyClient),
    VehicleDriver: vehicleDriver,
    DestinyDirection: String(request.DestinyDirection),
    IndustrialShed: String(request.IndustrialShed),
  } as Request;
};
