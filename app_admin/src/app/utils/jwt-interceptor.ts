import { Injectable, Provider } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Authentication } from '../services/authentication';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private readonly authenticationService: Authentication
  ) { }
  intercept(request: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    let isAuthAPI: boolean;
    //console.log('Interceptor::URL' + request.url);
    if (request.url.endsWith('login') ||
      request.url.endsWith('register')) {
      isAuthAPI = true;
    }
    else {
      isAuthAPI = false;
    }
    if (this.authenticationService.isLoggedIn() && !isAuthAPI) {
      let token = this.authenticationService.getToken();
      // console.log(token);
      const authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(authReq);
    }
    return next.handle(request);
  }
};

export const authInterceptProvider: Provider =
{
  provide: HTTP_INTERCEPTORS,
  useClass: JwtInterceptor, multi: true
};
