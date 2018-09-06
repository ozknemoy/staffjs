import {Table, Column, Model, PrimaryKey, Unique, AutoIncrement, ForeignKey, BelongsTo, NotEmpty} from 'sequelize-typescript';
import Personnel from "../personnel.model";
import {IPersonnel} from "../personnel.interface";
import IWorkExp from './personnel-work-exp.interface';

@Table({
  tableName: 'work-experience'
})
export default class Workplace extends Model<Workplace> implements IWorkExp {

  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column id: number;

  @NotEmpty
  @Column
  @ForeignKey(() => Personnel)
  personnelId: number;

  @BelongsTo(() => Personnel)
  personnel: IPersonnel;

  @Column amountD: number;
  @Column amountM: number;
  @Column amountY: number;

}
