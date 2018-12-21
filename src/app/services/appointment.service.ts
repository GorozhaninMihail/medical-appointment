import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {Observable} from 'rxjs';
import {ClinicId, DoctorId} from '../models';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  constructor(private apiService: ApiService) {}

  makeAppointment(
    clinicId: ClinicId,
    doctorId: DoctorId,
    date: Date | string,
    time: string,
    description: string,
  ): Observable<any> {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    return this.apiService.post('/order', {
      clinicId,
      doctorId,
      date: formattedDate,
      time,
      description,
    });
  }
}
