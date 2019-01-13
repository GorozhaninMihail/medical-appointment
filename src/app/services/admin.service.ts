import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiService} from './api.service';
import {ISpeciality, DoctorId, SpecialityId, ClinicId} from '../models';
import {format} from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private apiService: ApiService) {}

  getStats(): Observable<any> {
    return this.apiService.get('/admin/stats');
  }

  getAllSpecialities(): Observable<ISpeciality[]> {
    return this.apiService.get('/admin/specialities');
  }

  addSpeciality(name: string): Observable<ISpeciality> {
    return this.apiService.post('/admin/specialities', {name});
  }

  deleteSpeciality(specialityId: SpecialityId): Observable<any> {
    return this.apiService.post(
      '/admin/specialities/delete',
      {id: specialityId},
    );
  }

  addOrUpdateDoctor(
    id: DoctorId,
    specialityId: SpecialityId,
    experience: number,
    information: string,
    active: boolean,
  ) {
    return this.apiService.post(`/doctors/${id}`, {
      specialityId,
      experience,
      information,
      active,
    });
  }

  addTimesheetRecord(
    doctorId: DoctorId,
    clinicId: ClinicId,
    date: Date,
    time: string,
  ) {
    return this.apiService.post('/admin/timesheet', {
      doctorId,
      clinicId,
      date: date.getTime(),
      time,
    });
  }
}
