import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebhooksService {

  constructor(private httpClient: HttpClient) { }

  private url: string = '/webhooks';

  modifyPaymentStatus(wooId: number, paymentStatus: string): Observable<any> {
    const reqBody = {
      id: wooId,
      status: paymentStatus,
    };

    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    let options = {
      headers: httpHeaders
    };

    return this.httpClient.post(this.url + '/update', reqBody, options);
  }

  getWcOrder(id): Observable<any> {
    return this.httpClient.get(this.url + `/get/${id}`);
  }
}
