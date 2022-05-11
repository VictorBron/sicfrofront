export const DRIVERS_API = {
  GET_DRIVERS: {
    key: 'GET_DRIVERS',
    path: 'driver/drivers',
  },
  GET_DRIVERS_RUT: {
    key: 'GET_DRIVERS',
    path: 'driver/drivers/RUT',
  },
  GET_DRIVER_BY_ID: {
    key: 'GET_DRIVER_BY_ID',
    path: 'driver/driver/{id}',
    params: {
      id: {
        key: 'id',
        value: '',
      },
    },
  },
  POST_DRIVER: {
    key: 'POST_DRIVER',
    path: 'driver/driver',
  },
  POST_DRIVERS: {
    key: 'POST_DRIVER',
    path: 'driver/drivers',
  },
  DELETE_DRIVER: {
    key: 'DELETE_DRIVER',
    path: 'driver/driver/{id}',
    params: {
      id: {
        key: 'id',
        value: '',
      },
    },
  },
};
