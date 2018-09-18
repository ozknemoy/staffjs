import * as _ from 'lodash/core';
import Personnel from '../personnel/personnel.model';
import {INSTITUTIONS_NAME} from '../../../shared/constants';
import {HandleData} from '../../../client/app/shared/services/handle-data';
import * as moment from 'moment';
import {IPdfSchema} from '../../interfaces/pdf-shema.interface';
import {defaultFontSize, defaultTableLayout, tableFontSize} from './print.constants';
import IInstitution from "../personnel/relations/personnel-institution.interface";

export class PrintT2Builder {
  private pdf = [];

  constructor(private pers: Personnel) {
  }

  make() {
    return this
      //.makeHeader()
      .makeSectionOne()
      //.makeFamilyTable()
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
        widths: ['auto', 'auto', 'auto', 'auto', 22, 'auto', 50, 'auto'],
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
      //
      // registerDefaultTableLayouts
      layout: 'noBorders'
    }];
    const mainInfo = [
      {
        columns: [
          '1. Фамилия',
          {text: HandleData.getUnderlined(worker.surname, 30), decoration: 'underline'},
          {text: 'Имя', alignment: 'right'},
          {text: worker.name, decoration: 'underline'},
          {text: 'Отчество', alignment: 'right'},
          {text: worker.middleName, decoration: 'underline'}
        ],
        columnGap: 5
      }, {
        text: [
          '2. Дата рождения  ',
          {
            text: worker.passport ? HandleData.getRuDate(worker.passport.birthDate) : '',
            decoration: 'underline'
          },
        ]
      }, {
        text: [
          '3. Место рождения  ',
          {
            text: worker.passport ? worker.passport.birthPlace : '',
            decoration: 'underline'
          },
        ]
      }, {
        text: [
          '4. Гражданство  ',
          {
            text: worker.passport ? worker.passport.citizenship : '',
            decoration: 'underline'
          },
        ]
      }, {
        columns: [
          {
            text: '5. Знание иностранного языка',
            width: '40%'
          }, {
            text: worker.foreignLanguage,
            decoration: 'underline'
          }, {
            text: worker.foreignLanguageGrade,
            decoration: 'underline'
          }
        ]
      }, {
        text: [
          '6. Образование ',
          {
            text: worker.educationName,
            decoration: 'underline'
          },
        ]
      },
    ];

    const firstEdu = !_.isEmpty(worker.institutions) ? worker.institutions[0] : new IInstitution();
    const eduTables =
      {
        fontSize: tableFontSize,
        table: {
          //widths: ['auto', 'auto', 'auto', 'auto', 22, 'auto', 50, 'auto'],
          body: [[
            {text: 'Наименование образовательного учреждения', rowSpan: 2},
            {text: 'Документ об образовании, о квалификации или наличии специальных знаний', colSpan: 3}, {}, {},
            {text: 'Год окончания', rowSpan: 2},
            {text: 'Квалификация по документу об образовании', rowSpan: 2},
            {text: 'Направление или специальность по документу', rowSpan: 2},
          ], [
            '', 'наименование', 'серия', 'номер', '', '', '',
          ], [
            firstEdu.name,
            firstEdu.docName,
            firstEdu.docCode,
            firstEdu.docNumber,
            HandleData.getRuDate(firstEdu.endDate),
            firstEdu.qualification,
            firstEdu.specialty
          ]]
        },
        //layout: defaultTableLayout
      }

    ;
    this.pdf = this.pdf.concat([/*title, undertitle, mainInfo,*/ eduTables]);
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
