import * as _ from 'lodash/core';
import Personnel from '../personnel/personnel.model';
import {INSTITUTIONS_NAME} from '../../../shared/constants';
import {HandleData} from '../../../client/app/shared/services/handle-data';
import * as moment from 'moment';
import {IPdfSchema} from '../../interfaces/pdf-shema.interface';
import {defaultFontSize, defaultTableLayout, tableFontSize} from './print.constants';

export class PrintT2Builder {
  private pdf = [];

  constructor(private pers: Personnel) {
  }

  make() {
    return this
      .makeHeader()
      .makeSectionOne()
      .makeFamilyTable()
      .build();
  }

  addEmptyRow(table: (string | number)[][], rowAmount: number): (string | number)[][] {
    if (!_.isEmpty(table) && table.length < rowAmount) {
      const columnAmount = table[0].length;
      const emptyRow = [];
      while (emptyRow.length < columnAmount) {
        emptyRow.push(' ');
      }
      while (table.length < rowAmount) {
        // каждый раз надо создавать новый массив тк копии библиотека игнорирует
        table.push(emptyRow.slice());
      }
    }
    return table;
  }

  private makeFamilyTable() {
    const f = this.pers.families;
    if (_.isEmpty(f)) {
      return this;
    }
    const body: (string | number)[][] = f.map((row) => [row.relationshipDegree, row.fullName, row.birthYear]);
    const tbl = {
      fontSize: tableFontSize,
      margin: [0, 15],
      table: {
        widths: [90, '*', 50],
        body: [[
          'Степень родства (ближайшие родственники)',
          'Фамилия, имя, отчество',
          'Год рождения'
        ]].concat(<string[][]>this.addEmptyRow(body, 5))
      },
      layout: defaultTableLayout
    };
    this.pdf.push(tbl);
    return this;
  }

  private makeHeader() {
    const worker = this.pers;
    // https://github.com/bpampuch/pdfmake/blob/master/examples/textDecorations.js
    const name = {text: INSTITUTIONS_NAME + '\n\n', decoration: 'underline', width: '*'/*, decorationStyle: 'dashed'*/};
    const tblBody = [[
      worker.contractDate ? moment(worker.contractDate).format('DD.MM.YYYY') : null,
      worker.number,
      worker.inn,
      worker.insurance,
      worker.surname ? worker.surname.charAt(0) : null,
      worker.workNature,
      worker.workType,
      worker.sex
    ]];
    const tbl = {
      fontSize: tableFontSize,
      table: {
        widths: ['auto', 'auto', 'auto', 'auto', 22, 'auto', 'auto', 'auto'],
        body: [[
          'Дата составления',
          'Табельный номер',
          'Идентификационный номер налогоплательщика',
          'Номер страхового свидетельства государственного пенсионного страхования',
          'Алфавит',
          'Характер работы',
          'Вид работы',
          'Пол',
        ]].concat(tblBody)
      },
      layout: defaultTableLayout
    };
    const title = {
      text: [
        {text: 'ЛИЧНАЯ КАРТОЧКА\n', fontSize: 14},
        {text: 'работника', fontSize: 10}
      ],
      alignment: 'center'
    };
    this.pdf.push(name);
    this.pdf.push(tbl);
    return this;
  }

  private makeSectionOne() {
    const worker = this.pers;
    const title = {
      text: [
        {text: 'ЛИЧНАЯ КАРТОЧКА\n', fontSize: 14, bold: true},
        {text: 'работника\n\n', fontSize: 11, bold: true},
        {text: 'I. ОБЩИЕ СВЕДЕНИЯ', fontSize: 11, bold: true}
      ],
      alignment: 'center',
      margin: [0, 10]
    };
    const undertitle = [{
      table: {
        widths: ['*', 125],
        body: [
          [
            {text: 'Трудовой договор', alignment: 'right', fontSize: defaultFontSize},
            {
              fontSize: tableFontSize,
              table: {
                widths: ['50%', '50%'],
                body: [
                  ['номер', worker.contractNumber],
                  ['дата', HandleData.getRuDate(worker.contractDate)]
                ]
              },
              layout: defaultTableLayout
            }]
        ]
      },
      //layout: Object.assign({noBorders: true}, defaultTableLayout),
      //alignment: 'right',
      // registerDefaultTableLayouts
       layout: 'noBorders'
    }];
    this.pdf = this.pdf.concat([title, undertitle]);
    console.log(this.pdf);

    return this;
  }

  private build(): IPdfSchema.Root {
    return {
      content: this.pdf,
      /*defaultStyle: {

      },*/
    };
  }
}
