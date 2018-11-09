import { Component } from '@angular/core';
import {HttpService} from '../../services/http.service';
import {Router} from "@angular/router";
import {ToastrService} from 'ngx-toastr';
import IUser from '../../../../server/components/user/user.interface';

@Component({
  selector: 'user-editor',
  templateUrl: './user-editor.component.html'
})
export class UserEditorComponent {
  public users: IUser[];
  public newUser = new IUser/*{
    password: null,
    login: null,
    rights: null,
  }*/;
  constructor(
    private httpService: HttpService,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    this.httpService.get('user/all').subscribe((users) => this.users = users)
  }

  deleteUser(i) {

    this.users.splice(i, 1)
  }

  createUser() {

  }
}
