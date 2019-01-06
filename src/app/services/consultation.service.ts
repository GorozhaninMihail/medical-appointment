import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiService} from './api.service';
import {DoctorId, SpecialityId, IConsultation, IMessage} from '../models';

@Injectable({
  providedIn: 'root',
})
export class ConsultationService {
  constructor(private apiService: ApiService) {}

  addQuestion(
    doctorId: DoctorId,
    specialityId: SpecialityId,
    title: string,
    message: string,
  ): Observable<any> {
    return this.apiService.post('/online', {
      doctorId,
      specialityId,
      title,
      message,
    });
  }

  getAll(): Observable<IConsultation[]> {
    return this.apiService.get('/online');
  }

  closeQuestion(id: number) {
    return this.apiService.post(`/online/${id}/close`, {});
  }

  getQuestion(id: number) {
    return this.apiService.get(`/online/${id}`);
  }

  addAnswer(id: number, message: string): Observable<IMessage> {
    return this.apiService.post(`/online/${id}`, {message});
  }
}
