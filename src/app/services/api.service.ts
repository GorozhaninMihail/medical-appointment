import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private apiPrefix = '/api/v1';

  get(
    path: string,
    params: HttpParams = new HttpParams(),
  ): Observable<any> {
    return this.http.get(`${this.apiPrefix}${path}`, {params});
  }

  post(path: string, body: any): Observable<any> {
    return this.http.post(`${this.apiPrefix}${path}`, body);
  }

  put(path: string, body: any): Observable<any> {
    return this.http.put(`${this.apiPrefix}${path}`, body);
  }

  delete(path: string): Observable<any> {
    return this.http.delete(`${this.apiPrefix}${path}`);
  }
}
