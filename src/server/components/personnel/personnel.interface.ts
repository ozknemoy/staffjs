import {IFamily} from "./relations/personnel-family.interface";
import {IPassport} from "./relations/personnel-passport.interface";
import IQualImprovement from "./relations/personnel-qual-improvement.interface";
import IAttestation from "./relations/personnel-attestation.interface";
import {IPersonnelNamedThingWithDoc} from "./relations/personnel-named-thing-with-doc.interface";
import IProfRetraining from "./relations/personnel-prof-retraining.interface";
import IInstitution from "./relations/personnel-institution.interface";
import IScientificInst from './relations/personnel-scientific-inst.interface';
import IWorkplace from "./relations/personnel-workplace.interface";
import IWorkExp from './relations/personnel-work-exp.interface';
import IAcademicRank from "./relations/academic-rank.interface";


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
  workHistoryFileUrl: string = null;
  medicalCert: boolean = null;
  membershipGAN: boolean = null;
  membershipGANDate: string = null;
  membershipOAN: boolean = null;
  membershipOANDate: string = null;
  medicalCertDate: string = null;
  psychoCert: boolean = null;
  psychoCertDate: string = null;
  convictionCert: boolean = null;
  disabilityDegree: string = null;
  scientificRank: string = null;

  attestations: IAttestation[] = null;
  institutions: IInstitution[] = null;
  families: IFamily[] = null;
  passport: IPassport = null;
  profRetrainings: IProfRetraining[] = null;
  qualificationImprovements: IQualImprovement[] = null;
  rewards: IPersonnelNamedThingWithDoc[] = null;
  scientificInst: IScientificInst[] = null;
  workplaces: IWorkplace[] = null;
  workExp: IWorkExp[] = null;
  academicRank: IAcademicRank[] = null;
}
