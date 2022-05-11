import { VehicleType } from './vehicle-type.model';

export interface Vehicle {
  Patent?: string;
  IdVehicle?: number;
  Description?: string;
  VehicleType?: VehicleType;
}
