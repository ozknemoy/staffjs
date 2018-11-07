import {IFamily} from "./relations/personnel-family.interface";
import {IPassport} from "./relations/personnel-passport.interface";
import IQualImprovement from "./relations/personnel-qual-improvement.interface";
import IAttestation from "./relations/personnel-attestation.interface";
import {IPersonnelNamedThingWithDoc} from "./relations/personnel-named-thing-with-doc.interface";
import IProfRetraining from "./relations/personnel-prof-retraining.interface";
import IInstitution from "./relations/personnel-institution.interface";
import IScientificInst from './relations/personnel-scientific-inst.interface';
import IWorkplace from "./relations/personnel-workplace.interface";
import WorkExp from "./relations/personnel-work-exp.model";
import ILaborContract from './relations/personnel-labor-contract.model';
import IWorkExp from './relations/personnel-work-exp.interface';


export class IPersonnel {
  id: number;

  number: string = null;
  inn: string = null;
  insurance: string = null;
  workNature: string = null;
  workType: string = null;
  sex: string = null;

  name: string = null;
  surname: string = null;
  middleName: string = null;
  contractNumber: string = null;
  contractDate: string = null;
  foreignLanguage: string = null;
  foreignLanguageGrade: string = null;
  educationName: string = null;
  afterInstEduName: string = null;

  profession: string = null;
  phone: string = null;
  // new
  workExpDate: string = null;
  medicalCert: boolean = null;

  attestations: IAttestation[] = null;
  institutions: IInstitution[] = null;
  families: IFamily[] = null;
  passport: IPassport = null;
  profRetrainings: IProfRetraining[] = null;
  qualificationImprovements: IQualImprovement[] = null;
  rewards: IPersonnelNamedThingWithDoc[] = null;
  scientificInst: IScientificInst = null;
  workplaces: IWorkplace[] = null;
  workExp: IWorkExp[] = null;
  laborContract: ILaborContract[] = null;
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


