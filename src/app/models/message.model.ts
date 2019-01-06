import {ConsultationId} from './consultation.model';
import {UserId} from './user.model';

export interface IMessage {
  consultationId: ConsultationId;
  userId: UserId;
  time: Date;
  message: string;
}
