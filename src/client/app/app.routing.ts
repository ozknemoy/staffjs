import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import {StaffListComponent} from "./components-view/staff/staff-list.component";
import {StaffEditComponent} from "./components-view/staff/staff-edit.component";

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
    component: StaffEditComponent
  }
];
