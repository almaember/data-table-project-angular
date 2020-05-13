import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private httpClient: HttpClient) { }

  private url = '/api/authority';

  getAuthority(): Observable<any> {
    return this.httpClient.get(this.url);
  }
}