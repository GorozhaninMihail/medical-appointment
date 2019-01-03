import {Injectable} from '@angular/core';
import * as moment from 'moment';
import {Observable} from 'rxjs';
import {ApiService} from './api.service';
import {IOrder, ClinicId, DoctorId} from '../models';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
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

  getOrders(): Observable<IOrder[]> {
    return this.apiService.get('/order');
  }

  changeOrderStatus(order: IOrder): Observable<any> {
    return this.apiService.put('/order', {
      clinicId: order.mc_id,
      userId: order.user_id,
      doctorId: order.doctor_id,
      date: moment(order.date).format('YYYY-MM-DD'),
      time: order.time,
    });
  }
}
