import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BROWSER_STORAGE } from '../storage'; 

@Injectable({ providedIn: 'root' })
export class UserData {
  private apiBaseUrl = 'http://localhost:3000/api/';

  constructor(
    private http: HttpClient, 
    //@Inject(BROWSER_STORAGE) private storage: Storage
  ) {}
/*
  // Helper to get headers with the JWT token
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.storage.getItem('travlr-token')}`
    });
  }
    */

  // Get current user data (including profile)
  public getProfile(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}user`);
  }

  // Update user profile preferences
  public updateProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}user/profile`, profileData);
  }
}
