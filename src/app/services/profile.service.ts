import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {JwtService} from './jwt.service';
import {Observable, BehaviorSubject} from 'rxjs';
import {map, distinctUntilChanged} from 'rxjs/operators';
import {IUser, IOrder} from '../models';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private apiService: ApiService,
    private jwtService: JwtService,
  ) {}

  private currentUserSubject = new BehaviorSubject<IUser>(null);
  public currentUser = this.currentUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());

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

  setUser(user: IUser): void {
    this.currentUserSubject.next(user);
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

  logOut(): void {
    this.jwtService.unsetToken();
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): IUser | null {
    return this.currentUserSubject.value;
  }
}
