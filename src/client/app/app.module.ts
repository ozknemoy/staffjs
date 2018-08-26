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
import {StaffListComponent} from "./components-view/staff/staff-list.component";
import {StaffEditComponent} from "./components-view/staff/staff-edit.component";
import {FormsModule} from "@angular/forms";
import {TabsModule} from "ngx-bootstrap/tabs";
import {PrintButtonComponent} from "./components-stateless/print-button.component";

const config: SocketIoConfig = { url: 'http://localhost:5400', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    ContactComponent,
    StaffListComponent,
    StaffEditComponent,

    FileUploaderComponent,
    PrintButtonComponent,
  ],
  imports: [
    FormsModule,
    NoopAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'nestJS' }),
    HttpClientModule,
    SocketIoModule.forRoot(config),
    RouterModule.forRoot(routes, {useHash: false}),
    FileUploadModule,
    ToastModule.forRoot(),
    TabsModule.forRoot(),
  ],
  providers: [
    PingService,
    HttpService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
