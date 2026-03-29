import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripData } from './trip-data';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Authentication {
  // setup our storage and service access
  constructor(
    @Inject(BROWSER_STORAGE) private readonly storage: Storage,
    private readonly tripDataService: TripData,
  ) {}

  // variable to handle AuthResponse
  authResponse: AuthResponse = new AuthResponse();

  // Get our token from our Storage provider.
  // NOTE: For this application we have decided that we will name
  // the key for our token 'travlr-token'
  public getToken(): string {
    let out: any;
    out = this.storage.getItem('travlr-token');
    // Make sure we return a string even if we don't have a token
    if (!out) {
      return '';
    }
    return out;
  }
  // Save our token to our Storage provider.
  // NOTE: For this application we have decided that we will name
  // the key for our token 'travlr-token'
  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }
  // Logout of our application and remove the JWT from Storage
  public logout(): void {
    this.storage.removeItem('travlr-token');
    this.storage.removeItem('travlr-user');
  }
  private decodeJwtPayload(token: string): any {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const base64Url = parts[1];
      const base64 = base64Url.replaceAll('-', '+').replaceAll('_', '/');
      const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);

      return JSON.parse(atob(padded));
    } catch {
      return null;
    }
  }
  /* original isLoggedIn method
  public isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = this.decodeJwtPayload(token);
    const exp = payload?.exp; // exp could be undefined
    if (typeof exp !== 'number') return false;

    return exp > Date.now() / 1000;
  }
    */
  public isLoggedIn(): boolean {
    const payload = this.decodeJwtPayload(this.getToken());
    if (!payload || typeof payload.exp !== 'number') {
      this.logout(); // automatically invalidate token
      return false;
    }
    return !!payload && typeof payload.exp === 'number' && payload.exp > Date.now() / 1000;
  }

  /* original getCurrentUser method
  // Retrieve the current user. This function should only be called
  // after the calling method has checked to make sure that the user
  // isLoggedIn.
  public getCurrentUser(): User {
    const token: string = this.getToken();
    const { email, name } = JSON.parse(atob(token.split('.')[1]));
    return { email, name } as User;
  }
    */
  public getCurrentUser(): User | null {
    //const token = this.getToken();
    //if (!token) return null;
    // get stored user first to avoid unnecessary token decoding
    const storedUser = this.getStoredUser();
    if (storedUser) return storedUser;

    const payload = this.decodeJwtPayload(this.getToken());
    if (!payload) return null;

    return {
      _id: payload._id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    } as User;
  }

  // Login method that leverages the login method in tripDataService
  // Because that method returns an observable, we subscribe to the
  // result and only process when the Observable condition is satisfied
  // Uncomment the two console.log messages for additional debugging
  // information.
  public login(user: User, passwd: string): Observable<any> {
    return this.tripDataService.login(user, passwd).pipe(
      tap((value: any) => {
        if (value) {
          console.log(value);
          this.authResponse = value;
          // save the token and user information to storage
          this.saveToken(value.token);
          if (value.user) {
            this.saveUser(value.user);
          }
        }
      }),
    );
  }
  // Register method that leverages the register method in
  // tripDataService
  // Because that method returns an observable, we subscribe to the
  // result and only process when the Observable condition is satisfied
  // Uncomment the two console.log messages for additional debugging
  // information. Please Note: This method is nearly identical to the
  // login method because the behavior of the API logs a new user in
  // immediately upon registration
  // updated to account for existing account
  public lastError: string | null = null;

  public register(user: User, passwd: string): Promise<void> {
    this.lastError = null;

    return new Promise((resolve, reject) => {
      this.tripDataService.register(user, passwd).subscribe({
        next: (value: any) => {
          if (value) {
            this.authResponse = value;
            this.saveToken(value.token);
            if (value.user) {
              this.saveUser(value.user);
            }
            resolve();
          }
        },
        error: (error: any) => {
          let message = 'Registration failed. Please try again.';
          if (error.status === 409) {
            message = 'This email is already registered.';
          } else if (error.error?.message) {
            message = error.error.message;
          }
          this.lastError = message;
          reject(new Error(message));
        },
      });
    });
  }

  // Method to check if the current user is an admin
  public isAdmin(): boolean {
    const user = this.getCurrentUser();
    //console.log('Checking admin status for user:', user);
    console.log('Current User in isAdmin check:', user); 
    return user?.role === 'admin';
  }
  // Method to save the current user to storage
  public saveUser(user: User): void {
    this.storage.setItem('travlr-user', JSON.stringify(user));
  }
  // Method to get the current user from storage
  public getStoredUser(): User | null {
    const data = this.storage.getItem('travlr-user');
    return data ? JSON.parse(data) : null;
  }
}
