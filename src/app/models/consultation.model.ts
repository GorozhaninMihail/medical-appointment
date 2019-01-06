import {DoctorId} from './doctor.model';
import {SpecialityId} from './speciality.model';
import {UserId} from './user.model';

export type ConsultationId = number;

export interface IConsultation {
  consultation_id: ConsultationId;
  completed: boolean;
  doctor_id?: DoctorId;
  specialist_id: SpecialityId;
  title: string;
  text: string;
  time: Date;
  user_id: UserId;
}
