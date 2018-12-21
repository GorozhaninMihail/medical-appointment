import {DoctorId} from './doctor.model';

export type ClinicId = number;

export interface IClinic {
  id: ClinicId;
  name: string;
  description: string;
  address: string;
  doctors: DoctorId[];
}
