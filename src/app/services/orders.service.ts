import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private httpClient: HttpClient) { };

  private url: string = '/api/orders';

  getAllOrders(query): Observable<any> {
    const params = new HttpParams()
      // Pagination
      .set('previousPageIndex', query.previousPageIndex)
      .set('pageIndex', query.pageIndex)
      .set('pageSize', query.pageSize)
      .set('length', query.length)
      // Sort
      .set('active', query.active)
      .set('direction', query.direction)
      // Filter Date;
      .set('startDate', query.startDate)
      .set('endDate', query.endDate)
      .set('isFilterByDate', query.isFilterByDate)
      // Filter Publish Date;
      .set('publishStartDate', query.publishStartDate)
      .set('publishEndDate', query.publishEndDate)
      .set('isFilterByPublishDate', query.isFilterByPublishDate)
      // Filter Product
      .set('isFilterByProduct', query.isFilterByProduct)
      .set('productName', query.productName)
      // Filter Name
      .set('isFilterByName', query.isFilterByName)
      .set('billingName', query.billingName);

    return this.httpClient.get(this.url, { params });
  };

  countAllOrders(query): Observable<any> {
    const params = new HttpParams()
      //Filter Date;
      .set('startDate', query.startDate)
      .set('endDate', query.endDate)
      .set('isFilterByDate', query.isFilterByDate)
      //Filter Product
      .set('isFilterByProduct', query.isFilterByProduct)
      .set('productName', query.productName);

    return this.httpClient.get(this.url + '/count', { params })
  };

  modifyCustomerArrivedStatus(orderId: number, arrived: boolean): Observable<any> {
    const reqBody = {
      orderId: orderId,
      arrived: arrived,
    };

    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    let options = {
      headers: httpHeaders
    };

    return this.httpClient.post(this.url + '/arrived', reqBody, options);
  };

  getProductNames(): Observable<any> {
    return this.httpClient.get(this.url + '/productnames');
  }

  getBillingNames(): Observable<any> {
    return this.httpClient.get(this.url + '/billingnames');
  }

}
