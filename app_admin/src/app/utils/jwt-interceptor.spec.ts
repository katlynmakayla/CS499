import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler } from '@angular/common/http';
import { JwtInterceptor } from './jwt-interceptor';
import { Authentication } from '../services/authentication';
import { of } from 'rxjs';


/* causes compilation errors
describe('jwtInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => JwtInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
*/


describe('JwtInterceptor', () => {
  let interceptor: JwtInterceptor;
  let authService: Authentication;

  beforeEach(() => {
    // Create a simple fake Authentication service
    const fakeAuthService = {
      isLoggedIn: () => false,
      getToken: () => ''
    };

    TestBed.configureTestingModule({
      providers: [
        JwtInterceptor,
        { provide: Authentication, useValue: fakeAuthService }
      ]
    });

    interceptor = TestBed.inject(JwtInterceptor);
    authService = TestBed.inject(Authentication);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add Authorization header when logged in', () => {
    // Override the fake service methods for this test
    authService.isLoggedIn = () => true;
    authService.getToken = () => 'dummy-token';

    const req = new HttpRequest('GET', '/api/data');

    // Plain HttpHandler stub
    const next: HttpHandler = {
      handle: (request: HttpRequest<any>) => {
        // Assert header
        expect(request.headers.get('Authorization')).toBe('Bearer dummy-token');
        //return null as any;
        return of()
      }
    };

    interceptor.intercept(req, next);
  });

  it('should not add Authorization header for login/register', () => {
    authService.isLoggedIn = () => true;

    const req = new HttpRequest('GET', '/login');

    const next: HttpHandler = {
      handle: (request: HttpRequest<any>) => {
        // Header should not be set
        expect(request.headers.has('Authorization')).toBe(false);
        //return null as any;
        return of()
      }
    };

    interceptor.intercept(req, next);
  });
});
