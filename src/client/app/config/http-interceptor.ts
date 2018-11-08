
import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {finalize, tap} from 'rxjs/operators';
import {Observable} from 'rxjs/index';

//https://angular.io/guide/http#intercepting-all-requests-or-responses
@Injectable()
export class MainInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
          tap(
            // Succeeds when there is a response; ignore other events
            event => event,
            // Operation failed; error is an HttpErrorResponse
            (err: HttpErrorResponse) => {
              // ошибки валидатора бека
              let message;
              if (err.status === 406 || err.status === 400 || err.status === 500) {
                message = ' ';
                message += err.error.join('</br>');
              }


              if (message) {
                this.injector.get(ToastrService).error(
                  message, 'Ошибка валидации.', {
                    enableHtml: true,
                    closeButton: true,
                    timeOut: 30e3
                  });
              }
              return err
            }
          ),
          // either completes or errors
          finalize(() => {})
        );
  }
}
