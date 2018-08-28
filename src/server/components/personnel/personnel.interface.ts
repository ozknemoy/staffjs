import {IFamily} from "./personnel-family.interface";
import {IPassport} from "./personnel-passport.interface";


export class IPersonnel {
  id: number;
  number: string = null;
  name: string = null;
  passport: IPassport = null;
  family: IFamily[] = null;
}


export class IPersonnelAdapter {
  constructor(args?) {
    if (args) {
      Object.keys(this).forEach((prop, i) => this[prop] = args[i])
    }
  }

  id: number;
  number: string = null;
  name: string = null;
  inn: string = null;
  insurance: string = null;
  // passport
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

  family: /*number[] |*/ IFamily[] = null;
}


