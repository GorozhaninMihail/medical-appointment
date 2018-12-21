import {SpecialityId} from './speciality.model';
import {ClinicId} from './clinic.model';

export type DoctorId = number;

export interface IDoctor {
  doctor_id: DoctorId;
  speciality_id: SpecialityId;
  experience: number;
  information: any;
  speciality: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  clinics?: ClinicId[];
  timesheet?: [{
    mc_id: ClinicId;
    date: Date;
    start: string;
  }];
}
