import * as _ from 'lodash/core';
import Personnel from '../personnel/personnel.model';
import {INSTITUTIONS_NAME} from '../../../shared/constants';
import {HandleData} from '../../../shared/handle-data';
import * as moment from 'moment';
import {IPdfSchema} from '../../../shared/interfaces/pdf-shema.interface';
import {defaultFontSize, defaultTableLayout, tableFontSize} from './print.constants';
import IInstitution from '../personnel/relations/personnel-institution.interface';
import {PrintHelpers} from './print-helpers.class';
import IScientificInst from '../personnel/relations/personnel-scientific-inst.interface';

export class PrintT2Builder {
  private pdf = [];

  constructor(private pers: Personnel) {
  }

  make() {
    return this
      .makeHeader()
      .makeSectionFirstToSixth()
      .makeSectionSeventh()
      .makeFamilyTable()
      .build();
  }

  private makeFamilyTable() {
    const f = this.pers.families;
    /*if (_.isEmpty(f)) {
      return this;
    }*/
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
        ], ...PrintHelpers.addEmptyRow(body, 5, 3)]
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
    const contractDate =  HandleData.where(this.pers.workplaces, 'active', true, true).contractDate;
    const tblBody = [
      HandleData.getRuDate(contractDate),
      worker.number,
      worker.inn,
      worker.insurance,
      worker.surname ? worker.surname.charAt(0) : null,
      worker.workNature,
      worker.workplaces && worker.workplaces.length ? worker.workplaces[0].attractionTerms : '',
      worker.sex
    ];
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
        ], tblBody]
      },
      layout: defaultTableLayout
    };

    this.pdf.push(name);
    this.pdf.push(tbl);
    return this;
  }

  private makeSectionFirstToSixth() {
    const contractNumber =  HandleData.where(this.pers.workplaces, 'active', true, true).contractNumber;
    const contractDate =  HandleData.where(this.pers.workplaces, 'active', true, true).contractDate;
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
                  ['номер', contractNumber],
                  ['дата', HandleData.getRuDate(contractDate)]
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
          {text: '1. Фамилия', width: 70},
          {text: HandleData.getUnderlined(worker.surname, 30, true), decoration: 'underline'},
          {text: 'Имя', alignment: 'right', width: 65},
          {text: HandleData.getUnderlined(worker.name, 30, true), decoration: 'underline'},
          {text: 'Отчество', alignment: 'right', width: 65},
          {text: HandleData.getUnderlined(worker.middleName, 23, true), decoration: 'underline'}
        ],
        columnGap: 5
      }, {
        text: [
          '2. Дата рождения  ',
          {
            text: HandleData.getUnderlined(worker.passport ? HandleData.getRuDate(worker.passport.birthDate) : '', 30),
            decoration: 'underline'
          },
        ]
      }, {
        text: [
          '3. Место рождения  ',
          {
            text: HandleData.getUnderlined(worker.passport ? worker.passport.birthPlace : '', 70),
            decoration: 'underline'
          },
        ]
      }, {
        text: [
          '4. Гражданство  ',
          {
            text: HandleData.getUnderlined(worker.passport ? worker.passport.citizenship : '', 50),
            decoration: 'underline'
          },
        ]
      }, {
        text: [
          '5. Знание иностранного языка ',
          {
            text: HandleData.getUnderlined(worker.foreignLanguage, 45),
            decoration: 'underline'
          },
          '  ',
          {
            text: HandleData.getUnderlined(worker.foreignLanguageGrade, 50),
            decoration: 'underline'
          }
        ]
      }, {
        text: [
          '6. Образование ',
          {
            text: HandleData.getUnderlined(worker.educationName, 100),
            decoration: 'underline'
          },
        ]
      },
    ];

    const bodyOne = (worker.institutions || []).map((inst) => this.getEduOneTableRow(inst));
    const eduTableOne = {
      margin: [0, 20],
      fontSize: tableFontSize,
      table: {
        body: [[
          {text: 'Наименование образовательного учреждения', rowSpan: 2},
          {text: 'Документ об образовании, о квалификации или наличии специальных знаний', colSpan: 3}, {}, {},
          {text: 'Год окончания', rowSpan: 2},
          {text: 'Квалификация по документу об образовании', rowSpan: 2},
          {text: 'Направление или специальность по документу', rowSpan: 2},
        ], [
          '', 'наименование', 'серия', 'номер', '', '', '',
        ], ...PrintHelpers.addEmptyRow(bodyOne, 2, 7)]
      },
      layout: defaultTableLayout
    };
    const afterInstEduName = {
      text: [
        'Послевузовское профессиональное образование ',
        {
          text: HandleData.getUnderlined(worker.afterInstEduName, 50),
          decoration: 'underline'
        },
      ]
    };
    const bodyTwo = (worker.scientificInst || []).map((inst) => this.getEduTwoTableRow(inst));
    const eduTableTwo = {
      margin: [0, 20],
      fontSize: tableFontSize,
      table: {
        body: [[
          'Наименование образовательного, научного учреждения',
          'Документ об образовании, номер, дата выдачи',
          'Год окончания',
          'Направление или специальность по документу',
        ], ...PrintHelpers.addEmptyRow(bodyTwo, 2, 4)]
      },
      layout: defaultTableLayout
    };
    this.pdf = this.pdf.concat([title, undertitle, mainInfo, eduTableOne, afterInstEduName, eduTableTwo]);

    return this;
  }

  private getEduTwoTableRow(scientificInst: IScientificInst) {
    return [
      scientificInst.name,
      scientificInst.fullInfo,
      HandleData.getRuDateWithoutDays(scientificInst.endDate),
      scientificInst.specialty
    ];
  }

  private getEduOneTableRow(inst: IInstitution) {
    return [
      inst.name,
      inst.docName,
      inst.docCode,
      inst.docNumber,
      HandleData.getRuDateWithoutDays(inst.endDate),
      inst.qualification,
      inst.specialty
    ];
  }

  private makeSectionSeventh() {
    const worker = this.pers;
    const seventh = {
      text: [
        '7. Профессия \t',
        {text: HandleData.getUnderlined(worker.profession, 70), decoration: 'underline'}
        ]
    };
    const eightTitle = {
      text: [
        `8. Стаж работы (по состоянию на ${HandleData.getRuDate(new Date)}):`
      ]
    };
    const eightTable = {

    };
    this.pdf = this.pdf.concat([seventh, eightTitle, eightTable]);
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
