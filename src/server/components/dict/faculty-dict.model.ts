import {AutoIncrement, Column, DefaultScope, HasMany, Model, PrimaryKey, Table, Unique} from "sequelize-typescript";
import {IFacultyDict} from "./faculty-dict.interface";
import {DepartmentDict} from "./department-dict.model";
import {IDepartmentDict} from "./department-dict.interface";

@DefaultScope({
  order: [['name', 'ASC']]
})
@Table({
  tableName: 'dict-faculty'
})
export class FacultyDict extends Model<FacultyDict> implements IFacultyDict {
  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column id: number;

  @HasMany(() => DepartmentDict)
  departments: IDepartmentDict[];

  @Column name: string;
}