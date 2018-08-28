import {IFamily} from "./relations/personnel-family.interface";
import {IPassport} from "./relations/personnel-passport.interface";
import IQualificationImprovement from "./relations/personnel-qual-improvement.interface";
import IAttestation from "./relations/personnel-attestation.interface";
import {IPersonnelNamedThingWithDoc} from "./relations/personnel-named-thing-with-doc.interface";
import IProfRetraining from "./relations/personnel-prof-retraining.interface";


export class IPersonnel {
  id: number;
  number: string = null;
  name: string = null;

  attestations: IAttestation[] = null;
  families: IFamily[] = null;
  passport: IPassport = null;
  profRetrainings: IProfRetraining[] = null;
  qualificationImprovements: IQualificationImprovement[] = null;
  rewards: IPersonnelNamedThingWithDoc[] = null;
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


