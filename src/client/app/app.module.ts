import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { PingService } from './shared/services/ping.services';
import {FileUploaderComponent} from "./components-stateless/file-uploader/file-uploader.component";
import {HttpService} from "./services/http.service";
import {StaffListComponent} from "./components-view/staff/staff-list.component";
import {StaffMainInfoComponent} from "./components-view/staff/main-info/main-info-edit.component";
import {PrintButtonComponent} from "./components-stateless/print-button.component";
import {vendorsModules} from './app.vendors';
import {QualImprovementComponent} from "./components-view/staff/qual-improvement/qual-improvement-edit.component";
import {StaffEditComponent} from "./components-view/staff/staff-edit.component";
import {FamilyComponent} from "./components-view/staff/family/family-edit.component";
import {EducationEditComponent} from "./components-view/staff/education/education-edit.component";

declare const require;
const pdfMake = require('pdfmake/build/pdfmake.js');
const pdfFonts = require('pdfmake/build/vfs_fonts.js');


pdfMake.vfs = pdfFonts.pdfMake.vfs;

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    ContactComponent,
    StaffListComponent,
    StaffEditComponent,
    StaffMainInfoComponent,
    QualImprovementComponent,
    FamilyComponent,
    EducationEditComponent,


    FileUploaderComponent,
    PrintButtonComponent,
  ],
  imports: vendorsModules,
  providers: [
    PingService,
    HttpService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
