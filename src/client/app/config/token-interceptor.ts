import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/index';

export class TokenInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //клонироуем запрос, что бы добавить новый заголовок
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('bearer'))
    });
    //передаем клонированный запрос место ориганального
    return next.handle(authReq);
  }
}
