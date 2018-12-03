import {Document, Paragraph, TextRun} from 'docx/build';
import {makeCommonHeader, makeRequisite} from "./labor-contract-helpers.class";
import {getTitle, pageMargins, setStandartStyles} from "./docx-helpers";
import {IPersonnel} from '../personnel/personnel.interface';
import {HandleData} from '../../../shared/handle-data';
import {salaryDict} from '../../../shared/dictionaries/salary.dict';

export class PrintExtraLaborContractDynamicBuilder {
  private doc = new Document({
    creator: "admin",
    title: "доп соглашение",
    description: "ExtraLaborContractDynamicBuilder",
  }, pageMargins);
  private activeWorkplace: IPersonnel['workplaces'][0];

  constructor() {
    setStandartStyles(this.doc)
  }

  make(worker: IPersonnel): Document {
    return this.makeDoc(worker, false);
  }

  makeMoreThanOne(workers: IPersonnel[]): Document {
    workers.forEach(worker => this.makeDoc(worker, true));

    return this.doc
  }

  private makeDoc(worker: IPersonnel, breakPage: boolean) {
    const salaries = HandleData.toKeyProp<any, number>(salaryDict, 'value', 'salary');
    HandleData.addCountedSalary(worker, salaries);
    this.activeWorkplace = <IPersonnel['workplaces'][0]>HandleData.where(worker.workplaces, 'active', true, true);
    const title = getTitle(`Дополнительное соглашение к Трудовому договору от ${HandleData.getRuDate(this.activeWorkplace.contractDate) || '____________'}\t№ ${this.activeWorkplace.contractNumber || '____'}`);
    if(breakPage) {
      title.pageBreakBefore()
    }
    this.doc.addParagraph(title);
    makeCommonHeader(this.doc, worker);

    const one = new Paragraph()
      .style('9')
      .addRun(new TextRun('1.').bold())
      .addRun(new TextRun('\tЗа выполнение трудовой функции '))
      .addRun(new TextRun('Работнику').bold())
      .addRun(new TextRun(` устанавливается ${this.activeWorkplace.rate ? this.activeWorkplace.rate * 100 : '_______'} % должностного оклада (пропорционально отработанному времени) в размере ${this.activeWorkplace.salary || '____________________'} рублей.`))
      .addRun(new TextRun('2.').break().bold())
      .addRun(new TextRun('\tОстальные условия Трудового договора остаются неизменными и Стороны подтверждают свои обязательства.'))
      .addRun(new TextRun('3.').break().bold())
      .addRun(new TextRun('\tНастоящее дополнительное соглашение вступает в силу с момента его подписания Сторонами.'));

    this.doc.addParagraph(one);
    makeRequisite(this.doc, worker);
    return this.doc
  }

}
