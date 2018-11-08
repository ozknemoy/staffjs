import {TabsModule} from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {routes} from './app.router';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {FileUploadModule} from 'ng2-file-upload';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';


export const vendorsModules = [
  FormsModule,
  NoopAnimationsModule,
  BrowserModule.withServerTransition({ appId: 'nestJS' }),
  HttpClientModule,
  RouterModule.forRoot(routes, {useHash: false}),
  FileUploadModule,
  ToastrModule.forRoot(),
  TabsModule.forRoot(),
  BsDropdownModule.forRoot(),
];
