import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
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
import {ProfRetrainingComponent} from './components-view/staff/prof-retrainig/prof-retrainig-edit.component';
import {AttestationComponent} from './components-view/staff/attestation/attestation-edit.component';
import {PassportComponent} from './components-view/staff/passport/passport-edit.component';
import {ArmyComponent} from './components-view/staff/army/army-edit.component';
import {WorkplaceComponent} from './components-view/staff/workplace/workplace-edit.component';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {MainInterceptor} from './config/http-interceptor';
import {RewardComponent} from './components-view/staff/reward/reward-edit.component';
import {SocialSecurityComponent} from './components-view/staff/social-security/social-security.component';
import {WorkExpComponent} from './components-view/staff/work-exp/work-exp-edit.component';
import {LaborContractComponent} from './components-view/staff/labor-contract/labor-contract-edit.component';
import {ConfirmButtonDirective} from './components-stateless/confirm-button.directive';


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
    ProfRetrainingComponent,
    AttestationComponent,
    PassportComponent,
    ArmyComponent,
    WorkplaceComponent,
    RewardComponent,
    SocialSecurityComponent,
    WorkExpComponent,
    LaborContractComponent,

    FileUploaderComponent,
    PrintButtonComponent,
    ConfirmButtonDirective,
  ],
  imports: vendorsModules,
  providers: [
    HttpService,
    {provide: HTTP_INTERCEPTORS, useClass: MainInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
