import IDoc from "../../../interfaces/doc.interface";


export default class IAcademicRank extends IDoc {
  constructor(public personnelId: number) {
    super()
  }
  id: number = null;
  rank: string = null;
  specialty: string = null;
  appointingAuthority: string = null;
  statementDate: string = null;
}
