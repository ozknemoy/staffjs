import {Table, Column, Model, PrimaryKey, Unique, AutoIncrement} from 'sequelize-typescript';

@Table({
  tableName: 'staff'
})
export default class Staff extends Model<Staff> implements IStaff {

  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column id: number;


  @Column number: string;
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


}

export class IStaff {
  constructor(args) {
    Object.keys(this).forEach((prop, i) => this[prop] = args[i])
  }

  id: number;
  number: string = null;
  name: string = null;
  inn: string = null;
  insurance: string = null;
  birthDate: string = null;
  birthPlace: string = null;
  citizenship: string = null;
  maritalStatus: string = null;
  passport: string = null;
  passportIssued: string = null;
  passportDate: string = null;
  address: string = null;
  passportRegDate: string = null;
  education: string = null;
  institution: string = null;
  institutionFaculty: string = null;
  graduationYear: string = null;
  institutionSpecialty: string = null;
  institutionQualification: string = null;
  diplomaNumber: string = null;
  afterInstEdu: string = null;
  afterInstEduFacility: string = null;
  afterInstDoc: string = null;
  afterInstGraduation: string = null;
  afterInstSpecialty: string = null;
  grade: string = null;
  scienceBranch: string = null;
  gradeDate: string = null;
}
