import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripData } from './trip-data';

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
  }
  private decodeJwtPayload(token: string): any {
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
  // Boolean to determine if we are logged in and the token is
  // still valid. Even if we have a token we will still have to
  // reauthenticate if the token has expired
  /*
  public isLoggedIn(): boolean {
    const token: string = this.getToken();
    if (token) {
      const payload = this.decodeJwtPayload(token);

      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }*/
  public isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = this.decodeJwtPayload(token);
    const exp = payload?.exp; // exp could be undefined
    if (typeof exp !== 'number') return false;

    return exp > Date.now() / 1000;
  }

  // Retrieve the current user. This function should only be called
  // after the calling method has checked to make sure that the user
  // isLoggedIn.
  public getCurrentUser(): User {
    const token: string = this.getToken();
    const { email, name } = JSON.parse(atob(token.split('.')[1]));
    return { email, name } as User;
  }

  // Login method that leverages the login method in tripDataService
  // Because that method returns an observable, we subscribe to the
  // result and only process when the Observable condition is satisfied
  // Uncomment the two console.log messages for additional debugging
  // information.
  public login(user: User, passwd: string): void {
    this.tripDataService.login(user, passwd).subscribe({
      next: (value: any) => {
        if (value) {
          console.log(value);
          this.authResponse = value;
          this.saveToken(this.authResponse.token);
        }
      },
      error: (error: any) => {
        console.log('Error: ' + error);
      },
    });
  }
  // Register method that leverages the register method in
  // tripDataService
  // Because that method returns an observable, we subscribe to the
  // result and only process when the Observable condition is satisfied
  // Uncomment the two console.log messages for additional debugging
  // information. Please Note: This method is nearly identical to the
  // login method because the behavior of the API logs a new user in
  // immediately upon registration
  /*
  public register(user: User, passwd: string): void {
    this.tripDataService.register(user, passwd)
      .subscribe({
        next: (value: any) => {
          if (value) {
            console.log(value);
            this.authResponse = value;
            this.saveToken(this.authResponse.token);
          }
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      })
  } 
      */
  // updated to account for existing account
  public lastError: string | null = null;

  public register(user: User, passwd: string): Promise<void> {
    this.lastError = null;

    return new Promise((resolve, reject) => {
      this.tripDataService.register(user, passwd).subscribe({
        next: (value: any) => {
          if (value) {
            this.authResponse = value;
            this.saveToken(this.authResponse.token);
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
}
