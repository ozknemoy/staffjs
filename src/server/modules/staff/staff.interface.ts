import {Table, Column, Model, PrimaryKey, Unique, AutoIncrement} from 'sequelize-typescript';

@Table({
  /*timestamps: true,*/
})
export default class StaffModel extends Model<StaffModel> {

  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column id: number;

  @Column number: number;
  @Column name: string;
  @Column inn: string;
  @Column insurance: string;
  @Column birthDate: string;
  @Column birthPlace: string;
  @Column citizenship: string;
  @Column maritalStatus: string;
  @Column passport: string;
  @Column passportIssued: string;
  @Column passportDate: string;
  @Column address: string;
  @Column passportRegDate: string;
  @Column education: string;
  @Column institution: string;
  @Column institutionFaculty: string;
  @Column graduationYear: string;
  @Column institutionSpecialty: string;
  @Column institutionQualification: string;
  @Column diplomaNumber: string;

  @Column afterInstEdu: string;
  @Column afterInstEduFacility: string;
  @Column afterInstDoc: string;
  @Column afterInstGraduation: string;
  @Column afterInstSpecialty: string;
  @Column grade: string;
  @Column scienceBranch: string;
  @Column gradeDate: string;

  @Column age: number;

  @Column breed: string;
}

export interface IStaff {
  readonly name: string;
  readonly age: number;
  readonly breed: string;
}