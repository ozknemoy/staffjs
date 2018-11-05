import {
  AutoIncrement, BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table, Unique, DefaultScope,
  DataType
} from 'sequelize-typescript';
import {IPersonnel} from "../personnel.interface";
import Personnel from "../personnel.model";
import IScientificInst from './personnel-scientific-inst.interface';


@Table({
  tableName: 'scientific-inst'
})
export default class ScientificInst extends Model<ScientificInst> implements IScientificInst {

  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column
  id: number;

  @ForeignKey(() => Personnel)
  @Column
  personnelId:  number;

  @BelongsTo(() => Personnel)
  personnel: IPersonnel;

  @Column name: string;
  @Column fullInfo: string;
  @Column specialty: string;
  @Column({type: DataType.DATE}) endDate: string;
}
