import {
  AutoIncrement, BelongsTo, Column, DefaultScope, ForeignKey, Model, PrimaryKey, Table,
  Unique
} from "sequelize-typescript";
import {IDepartmentDict} from "./department-dict.interface";
import {FacultyDict} from "./faculty-dict.model";
import {IFacultyDict} from "./faculty-dict.interface";

@DefaultScope({
  order: [['name', 'ASC']]
})
@Table({
  tableName: 'dict-depertment'
})
export class DepartmentDict extends Model<DepartmentDict> implements IDepartmentDict {
  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column id: number;

  @ForeignKey(() => FacultyDict)
  @Column facultyId: number;
  @BelongsTo(() => FacultyDict)
  faculty: IFacultyDict;

  @Column name: string;
}