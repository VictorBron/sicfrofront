import { TimeSpan } from '../../../shared/models';
import { Client } from '../../clients';

export interface Schedule {
  IdSchedule?: number;
  Client?: Client;
  DayFrom?: Date;
  DayTo?: Date;
  HourFrom?: TimeSpan;
  HourTo?: TimeSpan;
  Comment?: string;
  HourFromString?: string;
  HourToString?: string;
}
