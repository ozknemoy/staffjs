import {ISalaryDict} from "../../server/components/dict/salary-dict.interface";
import {ISalaryGroupDict} from "../../server/components/dict/salary-group-dict.interface";

export const salaryGroupDict: ISalaryGroupDict[] = [
  {id: 1, groupId: 1, name: 'Профессорско-преподавательский состав', salary: 20120},// 1 ППС
  {id: 2, groupId: 2, name: 'Научные работники', salary: 20120},// 2 НП

  {id: 3, groupId: 3, name: 'Общеотраслевые специалисты и служащие первого уровня', salary: 9600},// 3 АУП
  {id: 4, groupId: 3, name: 'Общеотраслевые специалисты и служащие второго уровня', salary: 9960},
  {id: 5, groupId: 3, name: 'Общеотраслевые специалисты и служащие третьего уровня', salary: 11070},

  {id: 6, groupId: 4, name: 'Общеотраслевые профессии рабочих первого уровня', salary: 8500},// 4 ОП
  {id: 7, groupId: 4, name: 'Общеотраслевые профессии рабочих второго уровня', salary: 9600},

  {id: 8, groupId: 5, name: 'Руководители структурных подразделений', salary: 20120},// 5 РП
  {id: 9, groupId: 6, name: 'Педагогические работники', salary: 9220},// 6 Пед. работники
  // 7 УВП
  // 8 Работники спорта
];

export const salaryDict: ISalaryDict[] = [
  // 1 ППС
  {coef: 1, parentGroupId: 1, id: null, name: 'Ассистент, преподаватель, с высшим образованием без предъявления требований к стажу '},
  {coef: 1.7, parentGroupId: 1, id: null, name: 'Ассистент, преподаватель, имеющий ученую степень кандидата наук'},
  {coef: 1.2, parentGroupId: 1, id: null, name: 'Старший преподаватель с высшим образованием'},
  // 2 НП
  {coef: 1, parentGroupId: 2, id: null, name: 'Младший научный сотрудник'},
  {coef: 1.1, parentGroupId: 2, id: null, name: 'Научный сотрудник'},
  {coef: 1.7, parentGroupId: 2, id: null, name: 'Младший научный сотрудник, имеющий ученую степень кандидата наук'},
  // 3 АУП
  {coef: 1, parentGroupId: 3, id: null, name: 'Агент по снабжению, архивариус, дежурный по этажу (общежитию), делопроизводитель, комендант, мащинистка, паспортист, секретарь, статистик '},
  {coef: 1.05, parentGroupId: 3, id: null, name: 'Должности служащих первого квалификационного уровня, по которым может устанавливаться производное должностное наименование «старший» '},

  // 4 ОП
  /*{coef: 1, parentGroupId: 4, id: null, name: ''},
  // 5 РП
  {coef: 1, parentGroupId: 5, id: null, name: ''},
  // 6 Пед. работники
  {coef: 1, parentGroupId: 6, id: null, name: ''},
  // 7 УВП
  {coef: 1, parentGroupId: 7, id: null, name: ''},
  // 8 Работники спорта
  {coef: 1, parentGroupId: 8, id: null, name: ''},
  // 9 ППС
  {coef: 1, parentGroupId: 9, id: null, name: ''},
  // 10 ППС
  {coef: 1, parentGroupId: 10, id: null, name: ''},*/
  //
  //{coef: 1, parentGroupId: 6, id: null, name: ''},

];
