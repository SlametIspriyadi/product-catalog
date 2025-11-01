import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export const credentialsInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,    
  next: HttpHandlerFn          
): Observable<HttpEvent<unknown>> => {
  console.log('Interceptor: Setting credentials for:', req.url);
  
  const clonedReq = req.clone({
    withCredentials: true
  });

  return next(clonedReq);
};