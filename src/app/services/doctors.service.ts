import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiService} from './api.service';
import {IDoctor, DoctorId} from '../models';

@Injectable({
  providedIn: 'root',
})
export class DoctorsService {
  constructor(private apiService: ApiService) {}

  getAll(): Observable<IDoctor[]> {
    return this.apiService.get('/doctors');
  }

  getById(id: DoctorId): Observable<IDoctor> {
    return this.apiService.get(`/doctors/${id}`);
  }
}
