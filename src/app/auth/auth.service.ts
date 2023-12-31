import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { AuthData } from './auth-data.model';

const BACKEND_URL = environment.apiUrl + '/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string;
  private isAuthenticated = false;
  private userId: string;
  private tokenTimer;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  createUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http.post(BACKEND_URL + '/signup', authData).subscribe({
      next: (response) => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.authStatusListener.next(false);
      },
    });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http
      .post<{ token: string }>(BACKEND_URL + '/login', authData)
      .subscribe({
        next: (response) => {
          this.token = response['token'];
          if (this.token) {
            const expiresInDuration = response['expiresIn'];
            this.userId = response['userId'];

            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.setAuthTimer(expiresInDuration);

            // Save token and expiration date in local storage
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(this.token, expirationDate, this.userId);

            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          this.authStatusListener.next(false);
        },
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.userId = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  autoAuthUser() {
    // Get auth data from local storage
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }

    // Check if token is valid
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.userId = authInformation.userId;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if (!token || !expirationDate || !userId) {
      return null;
    }

    return {
      token,
      expirationDate: new Date(expirationDate),
      userId,
    };
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
