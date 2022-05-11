export enum RequestStatesEnum {
  VALID = 'REQUESTS.REQUEST_STATE.VALID',
  DEFEATED = 'REQUESTS.REQUEST_STATE.DEFEATED',
  CANCELED = 'REQUESTS.REQUEST_STATE.CANCELED',
  UNKNOWN = 'REQUESTS.REQUEST_STATE.UNKNOWN',
  ALL = 'REQUESTS.REQUEST_STATE.ALL',
}

export interface RequestState {
  id: number;
  text: string;
  key?: string;
  state: boolean;
}

export const RequestStates: RequestState[] = [
  {
    id: 0,
    text: RequestStatesEnum.ALL,
    key: 'ALL',
    state: true,
  },
  {
    id: 1,
    text: RequestStatesEnum.VALID,
    key: 'VALID',
    state: true,
  },
  {
    id: 2,
    text: RequestStatesEnum.DEFEATED,
    key: 'DEFEATED',
    state: true,
  },
  {
    id: 3,
    text: RequestStatesEnum.CANCELED,
    key: 'CANCELED',
    state: false,
  },
];

export const getRequestStateById = (id: number): RequestState => {
  return RequestStates.find((elem: RequestState) => elem.id == id);
};

export const getRequestStateByKey = (key: string): RequestState => {
  return RequestStates.find((elem: RequestState) => elem.key == key);
};

export const isCanceledState = (id: number): boolean => {
  return RequestStates.find((elem: RequestState) => elem.id == id) === getRequestStateByKey('CANCELED');
};

export const getRequestState = (active: boolean, validityEnd?: Date): RequestState => {
  if (validityEnd) {
    const today: Date = new Date();
    today.setHours(0, 0, 0);
    return getRequestStateByKey(active ? (validityEnd >= today ? 'VALID' : 'DEFEATED') : 'CANCELED');
  }
  return getRequestStateByKey(active ? 'VALID' : 'CANCELED');
};
