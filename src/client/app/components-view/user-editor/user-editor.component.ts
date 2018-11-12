import { Component } from '@angular/core';
import {HttpService} from '../../services/http.service';
import {Router} from "@angular/router";
import {ToastrService} from 'ngx-toastr';
import IUser from '../../../../server/components/user/user.interface';

@Component({
  selector: 'admin-editor',
  templateUrl: './user-editor.component.html'
})
export class UserEditorComponent {
  public users: IUser[];
  public newUser = new IUser();
  constructor(
    private httpService: HttpService,
  ) {}

  ngOnInit() {
    this.httpService.get('user/all').then((users) => this.users = users)
  }

  deleteUser(i, id) {
    this.httpService.delete('user/' + id).then(() => {
      this.users.splice(i, 1)
    })

  }

  createUser() {
    this.httpService.postWithToast('user/new', this.newUser).then((user) => {
      this.users.push(<any>user);
      this.newUser = new IUser()
    })
  }
}
