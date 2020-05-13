import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  private url: string = '/login';

  postLoginData(username: string, password: string): Observable<any> {
    const reqBody = {
      username: username,
      password: password,
    };

    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    let options = {
      headers: httpHeaders
    };

    return this.httpClient.post(this.url, reqBody, options);
  }
}
