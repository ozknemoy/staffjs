import IDoc from '../../../interfaces/doc.interface';

export default class IQualImprovement {

  personnelId: number;
  qualImprovementDocId: number;
  doc: IDoc;
  startEduDate: string;
  endEduDate: string;
  type: string;
  institutionName: string;
  reason: string;

}
