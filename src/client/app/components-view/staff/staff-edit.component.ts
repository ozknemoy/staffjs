import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-staff-edit',
  template: `
  <ul class="nav justify-content-start">
    <li class="nav-item">
      <a [routerLink]="['/staff-edit', id]" class="nav-link">Основная информация</a>
    </li>
    <li class="nav-item">
      <a routerLink="qual-improvement" class="nav-link">Повышение квалификации</a>
    </li>
    <li class="nav-item">
      <a routerLink="family" class="nav-link">Состав семьи</a>
    </li>
  </ul>
  <router-outlet></router-outlet>
  `
})
export class StaffEditComponent implements OnInit {
  id;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
  }
}
