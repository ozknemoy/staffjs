import {Injectable} from "@angular/core";
import {FileUploader} from "ng2-file-upload";
import {HttpClient} from "@angular/common/http";
import {AUTH_HEADER_PROP, GET_AUTH_HEADER_VALUE} from "../config/token-interceptor";
import {ToastrService} from "ngx-toastr";
import {map} from 'rxjs/operators';
import {HandleData} from '../../../shared/handle-data';
import {saveAs} from "file-saver";

@Injectable()
export class HttpService {

  public BASE_URL = '';

  constructor(private http: HttpClient, private toast: ToastrService) {

  }

  _get<T>(url: string)  {
    return this.http.get<any>(this.BASE_URL + url)
  }

  get<T>(url: string)  {
    return this._get<any>(this.BASE_URL + url).toPromise()
  }

  post(url, data: any, textToast = '', config?)  {
    return <any>this.http.post(this.BASE_URL + url, data, config)
      .pipe(
        map(r => {
          this.checkAndShowToast(textToast);
          return r
        })
      )
      .toPromise()
  }

  checkAndShowToast(textToast) {
    if(textToast !=='') {
      this.toast.success('', textToast, {
        closeButton: true,
        timeOut: 7e3
      });
    }
  }

  postWithToast(url, data: any, textToast = 'Успешно создано', config?) {
    return this.post(url, data, textToast, config)
  }


  put(url, data: any, textToast = '', config?)  {
    return this.http.put<any>(this.BASE_URL + url, data, config)
      .pipe(
        map(r => {
          this.checkAndShowToast(textToast);
          return r
        })
      )
      .toPromise()
  }

  putWithToast<T>(url, data: any, textToast = 'Успешно сохранено', config?): Promise<T> {
    return <any>this.put(url, data, textToast, config)
  }

  delete(url, config?)  {
    return this.http.delete<any>(this.BASE_URL + url, config).toPromise()
  }

  uploadFileWithAuth(maxFileSize, url, filename = "file") {
    return new FileUploader({
      url: this.BASE_URL + url,
      "itemAlias": filename,
      autoUpload: true,
      maxFileSize,
      // withCredentials: false,
      headers: [{
        name: AUTH_HEADER_PROP,
        value: GET_AUTH_HEADER_VALUE()
      }]
    });
  }

  downloadAndSave(url: string, obj = {}) {
    return this.post(url, obj, undefined,
      {
        responseType: 'blob',
        // to display the full response & as 'body' for type cast
        observe: <'body'>'response',
      })
      .then((fullResponse) => {
        console.log(fullResponse['body']);
        saveAs(fullResponse['body'], HandleData.getFileNameFromHttpResponse(fullResponse));
        // скачивает из json исходника
        // pdfMake.createPdf(fullResponse.body).download(HandleData.getFileNameFromHttpResponse(fullResponse));
      })
  }

}
