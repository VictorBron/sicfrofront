import { URLDef } from '../../../models/api-URL.model';

export const VEHICLES_API: URLDef = {
  GET_VEHICLES: {
    key: 'GET_VEHICLES',
    path: 'vehicle/vehicles',
  },
  GET_VEHICLES_PATENT: {
    key: 'GET_VEHICLES_PATENT',
    path: 'vehicle/vehicles/patent',
  },
  GET_VEHICLE_BY_ID: {
    key: 'GET_VEHICLE_BY_ID',
    path: 'vehicle/vehicle/{id}',
    params: {
      id: {
        key: 'id',
        value: '',
      },
    },
  },
  GET_VEHICLE_TYPES: {
    key: 'GET_VEHICLE_TYPES',
    path: 'vehicle/vehicletypes',
  },
  POST_VEHICLE: {
    key: 'POST_VEHICLE',
    path: 'vehicle/vehicle',
  },
  POST_VEHICLES: {
    key: 'POST_VEHICLE',
    path: 'vehicle/vehicles',
  },
  DELETE_VEHICLE: {
    key: 'DELETE_VEHICLE',
    path: 'vehicle/vehicle/{id}',
    params: {
      id: {
        key: 'id',
        value: '',
      },
    },
  },
};
