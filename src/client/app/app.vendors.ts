import {TabsModule} from 'ngx-bootstrap/tabs';
import {SocketIoConfig, SocketIoModule} from 'ng-socket-io';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {routes} from './app.routing';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {FileUploadModule} from 'ng2-file-upload';
import {ToastModule} from 'ng2-toastr';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

const config: SocketIoConfig = { url: 'http://localhost:5400', options: {} };

export const vendorsModules = [
  FormsModule,
  NoopAnimationsModule,
  BrowserModule.withServerTransition({ appId: 'nestJS' }),
  HttpClientModule,
  SocketIoModule.forRoot(config),
  RouterModule.forRoot(routes, {useHash: false}),
  FileUploadModule,
  ToastModule.forRoot(),
  TabsModule.forRoot(),
];