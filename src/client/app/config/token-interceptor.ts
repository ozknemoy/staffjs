import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/index';

export const AUTH_HEADER_PROP = 'Authorization';
export const GET_AUTH_HEADER_VALUE = () => 'Bearer ' + localStorage.getItem('bearer');

export class TokenInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //клонироуем запрос, что бы добавить новый заголовок
    const authReq = req.clone({
      headers: req.headers.set(AUTH_HEADER_PROP, GET_AUTH_HEADER_VALUE())
    });
    //передаем клонированный запрос место ориганального
    return next.handle(authReq);
  }
}
