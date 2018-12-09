import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IClinic} from '../models';
import {ApiService} from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ClinicsService {
  constructor(private apiService: ApiService) {}

  getAll(): Observable<IClinic[]> {
    return this.apiService.get('/clinics');
  }

  getById(id: string): Observable<IClinic> {
    return this.apiService.get(`/clinics/${id}`);
  }

  add(clinicInfo: IClinic): Observable<any> {
    return this.apiService.post('/clinics', clinicInfo);
  }

  update(id: string, clinicInfo: IClinic): Observable<any> {
    return this.apiService.put(`/clinics/${id}`, clinicInfo);
  }

  delete(id: string): Observable<any> {
    return this.apiService.delete(`/clinics/${id}`);
  }
}
