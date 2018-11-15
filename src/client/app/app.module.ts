import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { EmploymentContractComponent } from './components-view/employment-contract/employment-contract.component';
import {FileUploaderComponent} from "./components-stateless/file-uploader.component";
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
import {ConfirmButtonDirective} from './components-stateless/confirm-button.directive';
import {TokenInterceptor} from './config/token-interceptor';
import {LoginComponent} from "./components-view/login/login.component";
import {AuthGuard} from "./services/auth-guard.service";
import {HomeComponent} from './components-view/home/home.component';
import {NavBarComponent} from './components-stateless/nav-bar/nav-bar.component';
import {UserRoleDirective} from './components-stateless/user-role.directive';
import {UserEditorComponent} from './components-view/user-editor/user-editor.component';
import {SuperAdminGuard} from './services/super-admin-guard.service';


declare const require;
const pdfMake = require('pdfmake/build/pdfmake.js');
const pdfFonts = require('pdfmake/build/vfs_fonts.js');


pdfMake.vfs = pdfFonts.pdfMake.vfs;

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    EmploymentContractComponent,
    UserEditorComponent,
    // staff
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

    FileUploaderComponent,
    PrintButtonComponent,
    ConfirmButtonDirective,
    NavBarComponent,
    UserRoleDirective,
  ],
  imports: vendorsModules,
  providers: [
    HttpService,
    AuthGuard,
    SuperAdminGuard,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: MainInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
