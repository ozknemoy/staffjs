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

  constructor(private pers: IPersonnel) {
    setStandartStyles(this.doc)
  }

  make(): Document {
    return this
      .makeHeader()
      .makeBodyAndRequisite()
      .build();
  }

  private makeHeader() {
    const worker = this.pers;
    const salaries = HandleData.toKeyProp<any, number>(salaryDict, 'value', 'salary');
    HandleData.addCountedSalary(this.pers, salaries);
    this.activeWorkplace = <IPersonnel['workplaces'][0]>HandleData.where(worker.workplaces, 'active', true, true);
    this.doc.addParagraph(getTitle(`Дополнительное соглашение к Трудовому договору от ${HandleData.getRuDate(this.activeWorkplace.contractDate) || '____________'}\t№ ${this.activeWorkplace.contractNumber || '____'}`));
    makeCommonHeader(this.doc, this.pers);
    return this
  }

  makeBodyAndRequisite() {
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
    makeRequisite(this.doc, this.pers);
    return this
  }



  private build() {
    return this.doc
  }
}
