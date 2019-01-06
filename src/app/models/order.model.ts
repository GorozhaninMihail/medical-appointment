import {UserId} from './user.model';
import {ClinicId} from './clinic.model';
import {DoctorId} from './doctor.model';

export enum OrderStatus {
  Open = 0,
  Closed = 1,
}

export interface IOrder {
  mc_id: ClinicId;
  doctor_id: DoctorId;
  address: string;
  date: Date;
  first_name: string;
  last_name: string;
  middle_name: string;
  mc_name: string;
  user_id: UserId;
  name: string;
  status: OrderStatus;
  time: string;
}
