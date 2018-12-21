import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private tokenKey = 'jwttoken';

  getToken(): string {
    return localStorage[this.tokenKey] || '';
  }

  setToken(token: string): void {
    localStorage[this.tokenKey] = token;
  }

  unsetToken(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
