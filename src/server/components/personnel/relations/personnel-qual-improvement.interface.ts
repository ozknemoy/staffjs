import IDoc from '../../../interfaces/doc.interface';

export default class IQualImprovement {

  personnelId: number = null;
  qualImprovementDocId: number = null;
  doc: IDoc = new IDoc();
  startEduDate: Date = null;
  endEduDate: Date = null;
  type: string = null;
  institutionName: string = null;
  reason: string = null;

}
