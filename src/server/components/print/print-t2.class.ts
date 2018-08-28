
import * as _ from 'lodash/core'
import Personnel from '../personnel/personnel.model';


export class PrintT2Builder {
  private pdf = [];
  constructor(private pers: Personnel) {}

  make() {
    return this
      .makeFamilyTable()
      .build()
  }

  private makeFamilyTable() {
    const f = this.pers.families;
    if (_.isEmpty(f)) {
      return this;
    }
    const body: (string | number)[][] = f.map((row) => [row.relationshipDegree, row.fullName, row.birthYear]);
    const tbl = {
      fontSize: 10,
      table: {
        widths: [90, '*', 90],
        body: [['Степень родства (ближайшие родственники)', 'Фамилия, имя, отчество', 'Год рождения']]
          .concat(<string[][]>body)
      }
    };
    this.pdf.push(tbl);
    return this;
  }

  private build() {
    return {content: this.pdf};
  }
}
