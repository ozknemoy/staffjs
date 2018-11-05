
import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import {Observable} from "rxjs/Observable";
import "rxjs/operator/catch";
import {ToastsManager} from 'ng2-toastr';
import {finalize, tap} from 'rxjs/operators';

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
                this.injector.get(ToastsManager).error(
                  message, 'Ошибка валидации.', {
                    enableHTML: true,
                    showCloseButton: true,
                    toastLife: 30e3
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
