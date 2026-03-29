import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BROWSER_STORAGE } from '../storage'; 
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Recommendations {
  private apiBaseUrl = 'http://localhost:3000/api/';

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) { }

  public getRecommendations(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.storage.getItem('travlr-token')}`
    });
    return this.http.get<any[]>(`${this.apiBaseUrl}recommendations`, { headers });
  }
}
