import {Table, Column, Model, PrimaryKey, Unique, AutoIncrement, DefaultScope} from 'sequelize-typescript';
import IUser from './user.interface';

@DefaultScope({
  attributes: ['id', 'login']
})
@Table({
  tableName: 'user'
})
export default class User extends Model<User> implements IUser {

  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column id: number;

  @Unique
  @Column login: string;
  @Column rights: number;
  @Column password: string;

}
