import { Vehicle } from '../../vehicles/models/vehicle.model';
import { Driver } from '../../drivers/models/driver.model';

export interface VehicleDriver {
  Id?: number;
  IdRequest?: number;
  Driver?: Driver;
  Vehicle?: Vehicle;
  Active?: boolean;
}
