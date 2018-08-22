import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';


import { AppComponent } from './app.component';
import { routes } from './app.routing';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { PingService } from './shared/services/ping.services';
import {FileUploadModule} from "ng2-file-upload";
import {FileUploaderComponent} from "./components-stateless/file-uploader/file-uploader.component";
import {HttpService} from "./services/http.service";
import {ToastModule} from "ng2-toastr";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {StaffListComponent} from "./staff/staff-list.component";

const config: SocketIoConfig = { url: 'http://localhost:5400', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    ContactComponent,
    StaffListComponent,

    FileUploaderComponent
  ],
  imports: [
    NoopAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'nestJS' }),
    HttpClientModule,
    SocketIoModule.forRoot(config),
    RouterModule.forRoot(routes),
    FileUploadModule,
    ToastModule.forRoot(),

  ],
  providers: [
    PingService,
    HttpService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
