import { VehicleDriver } from './vehicle-driver.model';
import { Vehicle } from '../../vehicles/models';
import { Driver } from '../../drivers/models';

export interface Request {
  IdRequest?: number;
  ValidityStart?: Date;
  ValidityEnd?: Date;
  ValidityStartHour?: string;
  ValidityEndHour?: string;
  Product?: string;
  Format?: string;
  NumAgreement?: string;
  OC?: string;
  NumAgris?: string;
  DestinyClient?: string;
  Modified?: Date;
  ModifiedBy?: string;
  VehicleDriver?: VehicleDriver[];
  VehicleDriverModified?: VehicleDriver[];
  VehicleDriverCreated?: VehicleDriver[];
  DestinyDirection?: string;
  IndustrialShed?: string;
  NumRequest?: number;
  Active?: boolean;
  disabled?: boolean;
}

export interface RequestTable {
  // Request
  IdRequest?: number;
  Active?: boolean;
  ValidityStart?: Date;
  ValidityEnd?: Date;
  ValidityStartHour?: string;
  ValidityEndHour?: string;
  Product?: string;
  NumAgreement?: string;
  OC?: string;
  NumAgris?: string;
  destinyClient?: string;
  Modified?: Date;
  ModifiedBy?: string;
  // Client
  IdClient?: number;
  ClientName?: string;
  // Driver
  IdDriver?: number;
  DriverName?: string;
  DriverRUT?: string;
  // Vehicle
  IdVehicle?: number;
  VehiclePatent?: string;
  disabled?: boolean;
  NumRequest?: number;
}

export interface RequestMassive {
  IdRow?: number;
  ValidityStart?: Date;
  ValidityEnd?: Date;
  ValidityStartHour?: string;
  ValidityEndHour?: string;
  IndustrialShed?: string;
  DestinyClient?: string;
  Product?: string;
  Format?: string;
  NumAgreement?: string;
  OC?: string;
  NumAgris?: string;
  DestinyDirection?: string;
  Driver_RUT?: string;
  Driver_Name?: string;
  Driver_LastName?: string;
  Driver_Telephone?: string;
  Patent?: string;
  comment?: string;
  Driver?: Driver;
  Vehicle?: Vehicle;
}
