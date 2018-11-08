import {Injectable} from "@angular/core";
import {FileUploader} from "ng2-file-upload";
import {HttpClient} from "@angular/common/http";
import {Observable, SubscribableOrPromise} from "rxjs/Observable";
import {AuthLocalStorage} from './auth-local-storage.service';

@Injectable()
export class HttpService {
  //public isBrowser = this.authLocalStorage.isBrowser;
  public BASE_URL = '';

  constructor(private http: HttpClient/*, private authLocalStorage: AuthLocalStorage*/) {

  }

  get<T>(url: string)  {
    return this.http.get<any>(this.BASE_URL + url)
  }

  post(url, data: any, config?)  {
    return this.http.post(this.BASE_URL + url, data, config)
  }


  put(url, data: any, config?)  {
    return this.http.put<any>(this.BASE_URL + url, data, config)
  }

  uploadFileWithAuth(maxFileSize, url, filename = "file") {
    return new FileUploader({
      url: this.BASE_URL + url,
      "itemAlias": filename,
      autoUpload: true,
      maxFileSize,
      // withCredentials: false,
      headers: [{
        name: 'X-AUTH-TOKEN',
        value: 'PiU '
      }]
    });
  }

  /*isAuth(): boolean {
    return !!this.getToken()
  }*/

  /*getToken() {
    if (this.isBrowser) {
      return this.authLocalStorage.get('hash');
    } else {
      return this.authLocalStorage.auth['hash']
    }

  }*/

}
