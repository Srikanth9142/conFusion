import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { Observable, of } from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private processHttpMsgService:ProcessHTTPMsgService,private http:HttpClient) { }

  getPromotions(): Observable<Promotion[]>{
    return this.http.get<Promotion[]>(baseURL+'promotions').pipe(
      catchError(this.processHttpMsgService.handleError));
  }

  getPromotion(id: string): Observable<Promotion>{
   return this.http.get<Promotion>(baseURL+'promotions/'+id).pipe(
     catchError(this.processHttpMsgService.handleError));
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return this.http.get<Promotion>(baseURL+'promotions?featured=true').pipe(
      map(promotion=>promotion[0])).pipe(catchError(this.processHttpMsgService.handleError));
  }

}
