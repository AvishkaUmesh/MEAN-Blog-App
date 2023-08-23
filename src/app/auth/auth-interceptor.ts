import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();

    // clone the request and add the token to the header
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`),
    });

    // pass the cloned request instead of the original request to the next handle
    return next.handle(authRequest);
  }
}
