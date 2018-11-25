import { EmploymentContractComponent } from './components-view/employment-contract/employment-contract.component';
import {StaffListComponent} from "./components-view/staff/staff-list.component";
import {StaffMainInfoComponent} from "./components-view/staff/main-info/main-info-edit.component";
import {QualImprovementComponent} from "./components-view/staff/qual-improvement/qual-improvement-edit.component";
import {StaffEditComponent} from "./components-view/staff/staff-edit.component";
import {FamilyComponent} from "./components-view/staff/family/family-edit.component";
import {EducationEditComponent} from "./components-view/staff/education/education-edit.component";
import {ProfRetrainingComponent} from './components-view/staff/prof-retrainig/prof-retrainig-edit.component';
import {AttestationComponent} from './components-view/staff/attestation/attestation-edit.component';
import {PassportComponent} from './components-view/staff/passport/passport-edit.component';
import {ArmyComponent} from './components-view/staff/army/army-edit.component';
import {WorkplaceComponent} from './components-view/staff/workplace/workplace-edit.component';
import {RewardComponent} from './components-view/staff/reward/reward-edit.component';
import {SocialSecurityComponent} from './components-view/staff/social-security/social-security.component';
import {WorkExpComponent} from './components-view/staff/work-exp/work-exp-edit.component';
import {LoginComponent} from "./components-view/login/login.component";
import {AuthGuard} from "./services/auth-guard.service";
import {Route} from "@angular/router";
import {HomeComponent} from './components-view/home/home.component';
import {UserEditorComponent} from './components-view/user-editor/user-editor.component';
import {SuperAdminGuard} from './services/super-admin-guard.service';
import {GotFiredStaffListComponent} from "./components-view/staff/got-fired-staff/got-fired-staff-list.component";
import {SalaryEditorComponent} from "./components-view/salary-editor/salary-editor.component";

export const routes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'login',
    component: LoginComponent
  }, {
    path: 'employment-contract',
    component: EmploymentContractComponent
  }, {
    path: 'admin-editor',
    component: UserEditorComponent,
    canActivate: [SuperAdminGuard]
  }, {
    path: 'staff-list',
    component: StaffListComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'got-fired-staff-list',
    component: GotFiredStaffListComponent,
    canActivate: [SuperAdminGuard]
  }, {
    path: 'salary-editor',
    component: SalaryEditorComponent,
    canActivate: [SuperAdminGuard]
  }, {
    path: 'staff-edit/:id',
    component: StaffEditComponent,
    children: [
      {
        path: '',
        component: StaffMainInfoComponent
      }, {
        path: 'passport',
        component: PassportComponent
      }, {
        path: 'qual-improvement',
        component: QualImprovementComponent
      }, {
        path: 'family',
        component: FamilyComponent
      }, {
        path: 'education',
        component: EducationEditComponent
      }, {
        path: 'prof-retrainig',
        component: ProfRetrainingComponent
      }, {
        path: 'attestation',
        component: AttestationComponent
      }, {
        path: 'army',
        component: ArmyComponent
      }, {
        path: 'workplace',
        component: WorkplaceComponent
      }, {
        path: 'reward',
        component: RewardComponent
      }, {
        path: 'social-security',
        component: SocialSecurityComponent
      }, {
        path: 'work-exp',
        component: WorkExpComponent
      }
    ]
  },
];
