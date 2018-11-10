
import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {finalize, tap} from 'rxjs/operators';
import {Observable} from 'rxjs/index';
import {Router} from "@angular/router";

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
            (errBody: HttpErrorResponse) => {
              // ошибки валидатора бека
              let errText;
              if (errBody.status === 406 || errBody.status === 400 || errBody.status === 500) {
                errText = ' ';
                errText += errBody.error.join('</br>');
              } else if (errBody.status === 401) {
                localStorage.removeItem('bearer');
                errText = ' Авторизация устарела';
                this.injector.get(Router).navigate(['login'])
              }


              if (errText) {
                this.injector.get(ToastrService).error(
                  errText, 'Ошибка валидации.', {
                    enableHtml: true,
                    closeButton: true,
                    timeOut: 30e3
                  });
              }
              return errBody
            }
          ),
          // either completes or errors
          finalize(() => {})
        );
  }
}
