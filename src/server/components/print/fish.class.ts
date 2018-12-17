import {Document, Paragraph, TextRun} from 'docx';
import {getOneOneP, addOneThreeP, makeCommonHeader, makeRequisite} from "./labor-contract-helpers.class";
import {
  addUnderlineText, emptyLine, getEmptyLinePlusText, getTitle, multiTab, pageMargins,
  setStandartStyles
} from "./docx-helpers";
import {IPersonnel} from "../personnel/personnel.interface";
import {HandleData} from "../../../shared/handle-data";
import * as _ from 'lodash'
import {PrintRequisitesBuilder} from "./print-requisites.class";
import IWorkplace from "../personnel/relations/personnel-workplace.interface";

export class FishDynamicBuilder {
  private doc = new Document({
    creator: "admin",
    title: "LaborContract",
    description: "LaborContract",
  }, pageMargins);

  constructor(private pers: IPersonnel) {
    setStandartStyles(this.doc)
  }

  make(): Document[] {
    return this
    .makeHeaderAndSectionOne()
      .build();
  }

  private makeHeaderAndSectionOne() {
    const worker = this.pers;
    const activeWorkplace = <IPersonnel['workplaces'][0]>worker.workplaces[0];
    const title = getTitle(`Дополнительное соглашение к Трудовому договору от ${HandleData.getRuDate(activeWorkplace.contractDate) || '____________'}    № ${activeWorkplace.contractNumber || '____'}`);
    this.doc.addParagraph(title);
    makeCommonHeader(this.doc, this.pers);
    return this
  }


  private build() {
    return [this.doc, new PrintRequisitesBuilder(this.pers).make()]
  }
}
