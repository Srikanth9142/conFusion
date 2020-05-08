import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProcessHTTPMsgService {

  constructor() { }
  public handleError(error:HttpErrorResponse|any){
    let errmsg = '';
    if(error.error instanceof(ErrorEvent)){
      errmsg = error.error.message;
    }else{
      errmsg = `${error.status} - ${error.statusText|| " "} ${error.error} `;
    }
    return throwError(errmsg);
  }
}
