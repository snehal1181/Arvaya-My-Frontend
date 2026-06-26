import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class HTTPintercptorInterceptor implements HttpInterceptor {

  constructor(private cookie: CookieService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.cookie.get('token');
    const deviceId = this.cookie.get('deviceId');
    const supportKey = this.cookie.get('supportKey');
 
    // Check if the request is trying to upload a file
    const isMultipart = request.body instanceof FormData;
 
    const modifiedRequest = request.clone({
      setHeaders: {
        // Set headers conditionally for file upload vs JSON
        ...(isMultipart ? {} : { 'Content-Type': 'application/json' }),
        apikey: 'JP76Ol1r5lMvzljKmeaTdP9EthTYzKFH',
        applicationkey: 'Xkit6MeT1Et4ZA2N',
        deviceid: deviceId || '',
        supportkey: supportKey || '',
        Token: token || '',
      },
    });
 
    return next.handle(modifiedRequest);
  }
  
}
