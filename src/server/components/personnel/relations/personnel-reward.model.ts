import {BelongsTo, Column, ForeignKey, Model, Table} from 'sequelize-typescript';
import PersonnelNamedThingWithDoc from './personnel-named-thing-with-doc.model';
import Doc from '../../../interfaces/doc.model';
import IDoc from '../../../interfaces/doc.interface';

@Table({
  tableName: 'reward'
})
export default class Reward extends PersonnelNamedThingWithDoc {
  @Column
  @ForeignKey(() => Doc)
  rewardDocId: number;

  @BelongsTo(() => Doc, 'rewardDocId')
  doc: IDoc;
}
