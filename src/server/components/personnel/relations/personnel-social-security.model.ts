import {Column, Table} from 'sequelize-typescript';
import PersonnelNamedThingWithDoc from './personnel-named-thing-with-doc.model';
import {ISocialSecurity} from "./personnel-social-security.interface";

@Table({
  tableName: 'social-security'
})
export default class SocialSecurity extends PersonnelNamedThingWithDoc implements  ISocialSecurity {
  @Column reason: string
}
