import { AboutComponent } from './about/about.component';
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

export const routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'about'
  }, {
    path: 'about',
    component: AboutComponent
  }, {
    path: 'contact',
    loadChildren: './contact/contact.module#ContactModule'
  }, {
    path: 'staff-list',
    component: StaffListComponent
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
