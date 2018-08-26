import {Injectable} from "@angular/core";
import {FileUploader} from "ng2-file-upload";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class HttpService {

  public BASE_URL = '';

  constructor(private http: HttpClient) {

  }

  get(url: string)  {
    return this.http.get(this.BASE_URL + url)
  }

  post(url, data: any)  {
    return this.http.post(this.BASE_URL + url, data)
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

}
