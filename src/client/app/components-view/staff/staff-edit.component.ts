import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpService} from '../../services/http.service';

@Component({
  selector: 'app-staff-edit',
  template: `
  <div class="btn-group" dropdown>
    <button dropdownToggle type="button" class="btn btn-sm btn-primary dropdown-toggle">
      Меню <span class="navbar-toggler-icon"></span>
    </button>
    <ul class="dropdown-menu" *dropdownMenu>
      <li class="nav-item">
        <a [routerLink]="['/staff-edit', id]" class="dropdown-item">1 Основная информация</a>
      </li>
      <li class="nav-item">
        <a [routerLink]="['labor-contract']" class="dropdown-item">1.1 Действующие трудовые договоры</a>
      </li>
      <li class="nav-item">
        <a routerLink="passport" class="dropdown-item">2 Паспорт</a>
      </li>
      <li class="nav-item">
        <a routerLink="education" class="dropdown-item">3 Образование</a>
      </li>
      <li class="nav-item">
        <a routerLink="qual-improvement" class="dropdown-item">4 Повышение квалификации</a>
      </li>
      <li class="nav-item">
        <a routerLink="family" class="dropdown-item">5 Состав семьи</a>
      </li>
      <li class="nav-item">
        <a routerLink="prof-retrainig" class="dropdown-item">6 Проф переподготовка</a>
      </li>
      <li class="nav-item">
        <a routerLink="attestation" class="dropdown-item">7 Аттестация</a>
      </li>
      <li class="nav-item">
        <a routerLink="army" class="dropdown-item">8 Воинский учет</a>
      </li>
      <li class="nav-item">
        <a routerLink="workplace" class="dropdown-item">9 Прием на работу</a>
      </li>
      <li class="nav-item">
        <a routerLink="reward" class="dropdown-item">10 Награды</a>
      </li>
      <li class="nav-item">
        <a routerLink="social-security" class="dropdown-item">11 Социальные льготы</a>
      </li>
      <li class="nav-item">
        <a routerLink="work-exp" class="dropdown-item">12 Стаж работы</a>
      </li>
    </ul>
  </div>
  <div class="btn-group" dropdown>
    <button dropdownToggle type="button" class="btn btn-sm btn-primary dropdown-toggle">
      Печать <span class="glyphicon glyphicon-print"></span>
    </button>
    <ul class="dropdown-menu" *dropdownMenu>
      <li class="nav-item">
        <button class="btn btn-sm btn-warning" (click)="printLaborContract()">Трудовой договор с начным сотрудником</button>
      </li>
    </ul>
  </div>
  <router-outlet></router-outlet>
  `
})
export class StaffEditComponent implements OnInit {
  id;
  constructor(private route: ActivatedRoute, private httpService: HttpService) {}

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
  }

  printLaborContract(type: string) {
    this.httpService.post('print/labor-contract-scientific/' + this.id, {}).toPromise().then(() => {

    })
  }
}
