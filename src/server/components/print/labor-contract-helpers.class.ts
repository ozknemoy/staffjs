import {Paragraph, TextRun, Document} from "docx";
import {
  addEmptyLineUnderlined, addEmptyLineWithTextUnderlined, addUnderlineText, getEmptyLinePlusText, getLRText,
  getTitle, redI, removeTableBorders
} from './docx-helpers';
import {IPersonnel} from "../personnel/personnel.interface";
import {HandleData} from "../../../client/app/shared/services/handle-data";
import * as _ from 'lodash';
import {attractionTermsDict} from "../../../shared/dictionaries/attraction-terms.dict";

export function makeCommonHeader(doc: Document, u: IPersonnel) {
  doc.addParagraph(
    getLRText(redI + 'Санкт-Петербург', '«___»_________20__г.')
    .style('9')
  );

  const five = new Paragraph()
    .style('9')
    .addRun(new TextRun('Федеральное государственное автономное образовательное учреждение высшего образования «Санкт-Петербургский   государственный   университет   аэрокосмического   приборостроения»,  в   лице   ректора/проректора')
      .tab()
      .break());
  doc.addParagraph(five);
  doc.addParagraph(addUnderlineText(720 * 9.5));
  doc.addParagraph(addEmptyLineUnderlined(true));
  const underFio = new Paragraph()
    .center()
    .style('8')
    .addRun(new TextRun('фамилия, имя, отчество').italic());
  doc.addParagraph(underFio);
  const six = new Paragraph()
    .style('9')
    .addRun(new TextRun('действующего на основании Устава /доверенности от_______20____  г. №________, '));
  doc.addParagraph(six);
  doc.addParagraph(addUnderlineText(720 * 3.5));
  const seven = new Paragraph()
    .style('9')
    .spacing({before: 50})
    .addRun(new TextRun('именуемое в  дальнейшем «'))
    .addRun(new TextRun('Работодатель').bold())
    .addRun(new TextRun('» или  «'))
    .addRun(new TextRun('Университет').bold())
    .addRun(new TextRun('», с одной стороны и ____________________________________'));
  doc.addParagraph(seven);
  const fio = HandleData.fieldsOrNotConcat([u.surname, u.name, u.middleName]);
  addEmptyLineWithTextUnderlined(doc, fio, true, '10', undefined, true);
  doc.addParagraph(underFio);
  const eight = new Paragraph()
    .style('9')
    .spacing({before: 50})
    .addRun(new TextRun('именуемый в дальнейшем «'))
    .addRun(new TextRun('Работник').bold())
    .addRun(new TextRun('», с другой стороны, именуемые в дальнейшем «'))
    .addRun(new TextRun('Стороны').bold())
    .addRun(new TextRun('», заключили настоящий договор о нижеследующем:'));
  doc.addParagraph(eight);
  doc.addParagraph(getTitle('1. Предмет трудового договора'));

  return doc
}

const onePointOneTextChunk1 = 'обеспечить условия труда, предусмотренные трудовым законодательством и иными нормативными правовыми актами, содержащими нормы трудового права, коллективным договором, соглашениями, локальными нормативными актами и настоящим трудовым договором, своевременно и в полном размере выплачивать ';
const onePointOneTextChunk2 = ' заработную плату, а ';
const onePointOneTextChunk3 = ' обязуется лично выполнять определенную настоящим трудовым договором трудовую функцию, соблюдать правила внутреннего распорядка Университета.';

export function getOneOneP() {
  return new Paragraph()
    .style('9')
    .spacing({before: 50})
    .addRun(new TextRun(onePointOneTextChunk1))
    .addRun(new TextRun('Работнику').bold())
    .addRun(new TextRun(onePointOneTextChunk2))
    .addRun(new TextRun('Работник').bold())
    .addRun(new TextRun(onePointOneTextChunk3));

}

export function addOneThreeP(doc: Document, worker: IPersonnel) {
  const text1 = new TextRun('по основной работе');
  if (worker.workType === attractionTermsDict[0].name) {
    text1.underline();
  }
  const text2 = new TextRun('по совместительству');
  if (worker.workType === attractionTermsDict[1].name) {
    text2.underline();
  }
  const oneThree = new Paragraph('1.3. Трудовой договор является договором .')
    .style('9')
    .addRun(text1)
    .addRun(new TextRun(' / '))
    .addRun(text2);
  doc.addParagraph(oneThree);
  doc.addParagraph(addUnderlineText(720 * 6));
}

export function makeRequisite(doc: Document, worker: IPersonnel) {
  doc.addParagraph(getTitle('Реквизиты и подписи сторон'));

  const table = doc.createTable(3, 3);
  table.getCell(0, 0).addContent(new Paragraph()
    .center()
    .addRun(new TextRun(' Работодатель ').bold()));
  table.getCell(0, 1).addContent(new Paragraph(' \t\t '));
  table.getCell(0, 2).addContent(new Paragraph()
    .center()
    .addRun(new TextRun(' Работник ').bold()));
  const line = '______________________________________________';
  const left = new Paragraph()
    .style('9')
    .center()
    .addRun(new TextRun('Федеральное государственное автономное'))
    .addRun(new TextRun(' образовательное учреждение высшего образования ').break())
    .addRun(new TextRun('“Санкт-Петербургский государственный').break().bold())
    .addRun(new TextRun(' университет аэрокосмического приборостроения”').break().bold())
    .addRun(new TextRun('Адрес:  190000,  Санкт-Петербург,').break())
    .addRun(new TextRun('ул. Большая Морская, д. 67, лит. А').break())
    .addRun(new TextRun('ИНН  7812003110/КПП 783801001').break());

  const right = new Paragraph('Фамилия, Имя, Отчество:')
    .style('9');
  const FIO = HandleData.getFIO([worker.surname, worker.name, worker.middleName], false);
  const FIO_SHORT = HandleData.getFIO([worker.surname, worker.name, worker.middleName]);
  if (FIO) {
    right.addRun(new TextRun(FIO).break().bold())
  } else {
    right
      .addRun(new TextRun(line).break())
      .addRun(new TextRun(line).break())
      .addRun(new TextRun(line).break());
  }

  right.addRun(new TextRun('Дата и место рождения:').break());
  const birthInfo = HandleData.fieldsOrNotConcat([HandleData.getRuDate(worker.passport.birthDate), worker.passport.birthPlace], ', ');
  const hasPassport = _.get(worker, 'passport');
  if (hasPassport && worker.passport.birthDate && worker.passport.birthPlace) {
    right
      .addRun(new TextRun(birthInfo).break().bold())
  } else {
    right
      .addRun(new TextRun(line).break());
  }
  right.addRun(new TextRun('Почт. индекс, адрес и телефон:').break());
  if (hasPassport && worker.passport.address) {
    right
      .addRun(new TextRun(HandleData.fieldsOrNotConcat([worker.passport.address, worker.phone], ', ')).break().bold())
  } else {
    right
      .addRun(new TextRun(line).break())
      .addRun(new TextRun(line).break())
      .addRun(new TextRun(line).break())
      .addRun(new TextRun(line).break())
  }
  const passportNum = HandleData.getTextOrDummy(_.get(worker, 'passport.number'), line.slice(20 - 1));
  const passportIssued = HandleData.getTextOrDummy(_.get(worker, 'passport.passportIssued'), line.slice(7 - 1));
  const inn = HandleData.getTextOrDummy(worker.inn, line.slice(6 - 1));
  const snils = HandleData.getTextOrDummy(worker.insurance, line.slice(14 - 1));
  right
    .addRun(new TextRun('паспорт (серия, №): ').break())
    .addRun(new TextRun(passportNum).bold())
    .addRun(new TextRun('выдан:  ').break())
    .addRun(new TextRun(passportIssued).bold())
    .addRun(new TextRun('ИНН:  ').break())
    .addRun(new TextRun(inn).bold())
    .addRun(new TextRun('Св-во с/с №:  ').break())
    .addRun(new TextRun(snils).bold());
  const footerL = new Paragraph()
    .addRun(new TextRun('Ректор (проректор)').break())
    .addRun(new TextRun('_______________/_________________').break());
  const footerR = new Paragraph()
    .addRun(new TextRun(`____________________ (______________________)`).break())
    .addRun(new TextRun('(подпись ').break().italic())
    .addRun(new TextRun('Работника').bold().italic())
    .addRun(new TextRun(')                       ФИО').italic());

  table.getCell(1, 0).addContent(left);
  table.getCell(1, 2).addContent(right);
  table.getCell(2, 0).addContent(footerL);
  table.getCell(2, 2).addContent(footerR);
  removeTableBorders(table, 3, 3);

  const one = new Paragraph('С Уставом, Правилами внутреннего распорядка, Правилами пропускного режима Университета, коллективным договором, правилами техники безопасности, правилами пожарной безопасности, требованиями по охране труда ознакомлен: ')
    .style('8')
    .spacing({before: 200})
  ;
  doc.addParagraph(one);
  const two = new Paragraph()
    .style('8')
    .right()
    .addRun(new TextRun(`____________________(${FIO_SHORT || '_____________'})`).break().italic())
    .addRun(new TextRun(' подпись Работника              ФИО      \t').break().italic())
  ;
  doc.addParagraph(two);
  const three = new Paragraph()
    .style('8')
    .addRun(new TextRun(`Экземпляр трудового договора на руки получил: ____________________(${FIO_SHORT || '_____________'})`).break())
    .addRun(new TextRun('\t\t\t                                         подпись Работника              ФИО').break().italic())
  ;
  doc.addParagraph(three);

}