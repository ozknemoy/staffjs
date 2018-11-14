
import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {finalize, tap} from 'rxjs/operators';
import {Observable} from 'rxjs/index';
import {Router} from "@angular/router";

//https://angular.io/guide/http#intercepting-all-requests-or-responses
@Injectable()
export class MainInterceptor implements HttpInterceptor {
  textStart = ' ';
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
              console.log('MainInterceptor', errBody);
              let errText;
              if (errBody.status === 406 || errBody.status === 400 || errBody.status === 500) {
                errText = this.textStart;
                // если была скачка файлов
                if (errBody.error instanceof Blob) {
                  this.blobToString(errBody.error).then(text => {
                    errText += JSON.parse(text).message.replace(/\;/g, '</br>');
                    this.showToast(errText)
                  })
                } else {
                  errText += errBody.error.message.replace(/\;/g, '</br>');
                }
              } else if (errBody.status === 401) {
                localStorage.removeItem('bearer');
                errText = ' Авторизация устарела';
                this.injector.get(Router).navigate(['login'])
              }


              if (errText && errText !== this.textStart) {
                this.showToast(errText)
              }
              return errBody
            }
          ),
          // either completes or errors
          finalize(() => {})
        );
  }

  blobToString(blob): Promise<string> {
    return new Promise((res, fail) => {
      const reader = new FileReader();
      // This fires after the blob has been read/loaded.
      reader.addEventListener('loadend', (e) => {
        const text = e.srcElement['result'];
        console.log(text);
        reader.removeEventListener('loadend', undefined);
        res(text)
      });

      // Start reading the blob as text.
      reader.readAsText(blob);
    })
  }

  showToast(errText) {
    this.injector.get(ToastrService).error(
      errText, 'Ошибка', {
        enableHtml: true,
        closeButton: true,
        timeOut: 30e3
      });
  }
}
