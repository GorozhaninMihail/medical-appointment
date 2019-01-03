import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiService} from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private apiService: ApiService) {}

  getStats(): Observable<any> {
    return this.apiService.get('/admin/stats');
  }

  addSpeciality(name: string): Observable<any> {
    return this.apiService.post('/admin/specialities', {name});
  }
}
