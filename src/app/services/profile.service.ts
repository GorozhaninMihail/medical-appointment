import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {JwtService} from './jwt.service';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {IUser, IOrder} from '../models';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private apiService: ApiService,
    private jwtService: JwtService,
  ) {}

  private currentUser: IUser | null = null;

  fetchCurrentUser(): void {
    if (this.jwtService.getToken()) {
      this.apiService.get('/currentuser')
        .subscribe(
          (user: IUser) => this.setUser(user),
          err => this.logOut(),
        );
    } else {
      this.logOut();
    }
  }

  logOut(): void {
    this.jwtService.unsetToken();
    this.currentUser = null;
  }

  setUser(user: IUser): void {
    this.currentUser = user;
  }

  register(
    firstName: string,
    lastName: string,
    middleName: string = '',
    email: string,
    phone: string,
    password: string,
  ): Observable<any> {
    return this.apiService.post('/signup', {
      firstName,
      lastName,
      middleName,
      email,
      phone,
      password,
    });
  }

  logIn(id: string, password: string): Observable<any> {
    return this.apiService.post('/login', {
      id,
      password,
    }).pipe(map(
      data => {
        this.jwtService.setToken(data.token);
        return data;
      },
    ));
  }

  getCurrentUser(): IUser | null {
    return this.currentUser;
  }

  getOrders(): Observable<IOrder[]> {
    return this.apiService.get('/orders');
  }
}
