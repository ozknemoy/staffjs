import { AboutComponent } from './about/about.component';
import {StaffListComponent} from "./components-view/staff/staff-list.component";
import {StaffMainInfoComponent} from "./components-view/staff/main-info/main-info-edit.component";
import {QualImprovementComponent} from "./components-view/staff/qual-improvement/qual-improvement-edit.component";
import {StaffEditComponent} from "./components-view/staff/staff-edit.component";
import {FamilyComponent} from "./components-view/staff/family/family-edit.component";
import {EducationEditComponent} from "./components-view/staff/education/education-edit.component";
import {ProfRetrainingComponent} from './components-view/staff/prof-retrainig/prof-retrainig-edit.component';

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
      }
    ]
  }, /**/
];
