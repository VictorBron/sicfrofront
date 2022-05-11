import { Request, RequestTable } from '../../../modules/requests/models';
import { CommonObject, ErrorResponse } from '../../models';
import { dateEarlierThanNow } from '../dates';

const isEditDisabled = (row: RequestTable | Request): boolean => {
  return dateEarlierThanNow(row.ValidityStart, row.ValidityStartHour);
};

export const setEditableAttribute = (
  list: Request | RequestTable[] | ErrorResponse,
): Request | RequestTable[] | ErrorResponse => {
  const errControl = list as unknown as ErrorResponse;
  if (errControl && errControl.Data && errControl.Code) return errControl;
  if (list instanceof Array) {
    if (list.length > 0)
      return (list as unknown as RequestTable[]).map(elem => {
        elem = {
          ...elem,
          disabled: isEditDisabled(elem as RequestTable),
        };
        return elem;
      });
    else return list;
  } else {
    if (list as RequestTable)
      list = {
        ...list,
        disabled: isEditDisabled(list as Request),
      };
    return list;
  }
};

export const convertStrToDate = <T>(element: T, ...attrs: string[]): T | ErrorResponse => {
  const common = element as unknown as CommonObject;

  attrs?.forEach(attr => {
    common[attr] = new Date(element[attr as keyof typeof element] as unknown as string);
  });

  return element as T;
};

export const convertStrToDateList = <T>(list: T[], ...attrs: string[]): T[] | ErrorResponse => {
  const errControl = list as unknown as ErrorResponse;
  if (errControl && errControl.Data && errControl.Code) return errControl;
  return list?.map(elem => {
    const common = elem as unknown as CommonObject;

    attrs?.forEach(attr => {
      common[attr] = new Date(common[attr] as string);
    });

    return elem as T;
  });
};

export const extractAttributes = <T, K>(list: T[], c: K, ...attrs: string[]): K[] => {
  let newObjectData: K[] = [];
  list?.forEach(req => newObjectData.push(getParam(req, c, attrs)));
  return newObjectData;
};

export const getParam = <T, K>(object: T, c: K, attrs: string[]): K => {
  let newObject: K = { ...object } as unknown as K;
  attrs.forEach(
    key =>
      (newObject = {
        ...newObject,
        ...(newObject[key as keyof typeof newObject] as unknown as K),
      }),
  );

  return newObject;
};
