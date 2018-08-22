import {Injectable} from "@angular/core";
import {FileUploader} from "ng2-file-upload";

@Injectable()
export class HttpService {

  public BASE_URL = '';

  contructor() {

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
