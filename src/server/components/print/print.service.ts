import {Injectable} from '@nestjs/common';
import {PersonnelService} from '../personnel/personnel.service';
import {PrintT2Builder} from './print-t2.class';
import {IPdfSchema} from '../../../shared/interfaces/pdf-shema.interface';
import * as fs from 'fs-extra';
import {PrintLaborContractDynamicBuilder} from './print-labor-contract.class';
import * as docx from "docx";
import LaborContractDocx from "./labor-contract-docx.model";
import {ErrHandler} from "../../services/error-handler.service";
import {dirLaborContractDocx} from "../upload/upload.service";
import {FOLDER_SERVER, WORKING_DIRECTORY} from "../../../shared/constants";
import Workplace from '../personnel/relations/personnel-workplace.model';
import Personnel from '../personnel/personnel.model';
import * as _ from 'lodash';
import {IServerFilter} from '../../../shared/interfaces/server-filter.interface';
import xlsx from "node-xlsx";
import {HandleData} from '../../../shared/handle-data';
import {PrintRequisitesBuilder} from "./print-requisites.class";
import Passport from "../personnel/relations/personnel-passport.model";
import {ISalaryDict} from "../dict/salary-dict.interface";
import {DictService} from "../dict/dict.service";
import {PrintExtraLaborContractDynamicBuilder} from "./print-extra-labor-contract.class";

const path = require('path');
const DocxMerger = require('../../../shared/docx-merger/docx-merger-dist.js');
const jszip = require("jszip");

const fontsDir = path.join(WORKING_DIRECTORY, FOLDER_SERVER, 'assets/fonts');
const fontDescriptors = {
  Roboto: {
    normal: path.resolve(fontsDir + '/Roboto-Regular.ttf'),
    bold: path.resolve(fontsDir + '/Roboto-Medium.ttf'),
    italics: path.resolve(fontsDir + '/Roboto-Italic.ttf'),
    bolditalics: path.resolve(fontsDir + '/Roboto-MediumItalic.ttf')
  }
};
const PdfPrinter = require('pdfmake');
const printer = new PdfPrinter(fontDescriptors);
export const tempDirForTesting = () => `${fs.existsSync('E:/') ? 'E' : 'C'}:/files/`;

@Injectable()
export class PrintService {

  constructor(private personnelService: PersonnelService, private dictService: DictService) {}

  async saveLocalForDevelopmentPdf() {
    const file = await this.printT2(2);
    this.saveExactNameOrWithTimestampLocal(tempDirForTesting(), 't2-dev', '.pdf', file);
    return;
  }

  async saveLocalForDevelopmentDocx() {
    return this.printLaborContract(194, '1', true);
  }

  async printT2(userId) {
    const user = await this.personnelService.getOneFull(userId);
    const pdfSchema: IPdfSchema.Root = new PrintT2Builder(user).make();
    return this.printPdf(printer.createPdfKitDocument(pdfSchema));
  }

  printPdf(doc) {
    return new Promise((res) => {
      const chunks = [];
      doc
        .on('data', chunk => {
          chunks.push(chunk);
        })
        .on('end', () => {
          const result = Buffer.concat(chunks);
          res(result);
        })
        .end();
    });
  }

  async printLaborContract(userId, typePart2, saveLocal) {
    // если нет активного места работы то заверну
    const user = await Personnel.findOne({where: {id: userId}, include: [{model: Workplace, where: {active: true}}, { all: true }]});
    if (!user) {
      ErrHandler.throw('Сначала выставите активное место работы (вкладка прием на работу)')
    }
    const docx = await LaborContractDocx.findOne({where: {type: +typePart2}});
    if (!docx || !docx.url) {
      ErrHandler.throw('Сначала загрузите статическую часть договора')
    }
    // наличие папки с файлами не проверяю тк если загружен хотя бы один файл то папка существует
    const part2Uint = fs.readFileSync(dirLaborContractDocx + docx.url);
    const [part1, part3] = new PrintLaborContractDynamicBuilder(user).make();
    const part1Uint = await this.createOfficeFileUint8(part1);
    const part3Uint = await this.createOfficeFileUint8(part3);
    const merger = new DocxMerger({pageBreak: false}, [part1Uint, part2Uint, part3Uint]);

    return new Promise((res, fail) => {
      merger.save('nodebuffer', (uint) => {
        res(saveLocal
          ? this.createOfficeFileLocal(uint)
          // браузеру нужен именно буффер
          : Buffer.from(uint)
        )
      });
    });
  }

  async createOfficeFileBuffer(dox): Promise<Buffer> {
    return Buffer.from(await <any>this.createOfficeFileUint8(dox))
  }

  createOfficeFileUint8(doc): Promise<Uint8Array> {
    // якобы возвращает Buffer а на самом деле Uint8Array
    // buffer['buffer'] это будет ArrayBuffer из Uint8Array
    return <any>(new docx.Packer()).toBuffer(doc)
  }

  createOfficeFileLocal(uint8) {
    this.saveExactNameOrWithTimestampLocal(tempDirForTesting(), 'doc-dev', '.docx', uint8);
    return {savedLocally: true};
  }

  saveExactNameOrWithTimestampLocal(dir: string, name: string, ext: string, buffer: Object) {
    console.log('-----  ok make  -----');
    // пробую писать
    fs.ensureDirSync(dir);
    fs.writeFile(dir + name + ext, buffer, (e) => {
      if (e) {
        console.log('*****    ', e.code, '  make with timestamp  *****');
        // при неудаче добавляю Timestamp
        fs.writeFileSync(`${dir}${name}-${ +new Date}${ext}`, buffer);
      } else {
        console.log('-----  ok write  ----');
        // при удаче удаляю файлы с номерами
        fs.readdir(dir, (_e, files) => {
          if (files.length) {
            files.forEach(fileName => {
              if (fileName.indexOf(name + '-') > -1) {
                fs.unlink(dir + fileName, () => {})
              }
            })
          }
        })
      }
    });
  }

  printOffice(doc) {
    return new Promise((res) => {
      doc
        .on('finalize', function (written, ret) {
          console.log('Finish to create a PowerPoint file.\nTotal bytes created: ' + written + '\n' + ret);
          res(written);
        })
        .on('error', function (err) {
          console.log(err);
        });
    });
  }

  async filterAndXls(fltr: IServerFilter) {
    const pers = await this.personnelService.filter(fltr);
    this.checkFilteredResultForEmptyness(pers);
    const fields = <any>{
      // 1
      surname: 'Фамилия',
      name: 'Имя',
      middleName: 'Отчество',
      phone: 'Номер телефона',
      inn: 'ИНН',
      insurance: 'СНИЛС',

      // пасспорт
      'passport.birthDate': 'Дата рождения',
      // 5
      'workplaces[0]department': 'Структурное подразделение',
      'workplaces[0]specialty': 'Должность',
      'workplaces[0]attractionTerms': 'Условия привлечения',
      'workplaces[0]contractNumber': 'Номер трудового договора',
      'workplaces[0]contractDate': 'Дата трудового договора',
      'workplaces[0]contractEndDate': 'Дата окончания трудового договора',
      'workplaces[0]salary': 'Тарифная ставка',
    };
    // только по запросу
    if(fltr.disabilityDegree) {
      fields.disabilityDegree = 'Инвалидность, степень'
    }
    const firstRow = _.values(fields);
    const rows = pers.map(worker =>
      Object.keys(fields).map(f => {
        let v = _.get(worker, f, '');
        v = HandleData.isInvalidPrimitive(v) ? '' : (v + '').trim();
        return HandleData.isServerRawDate(v) ? HandleData.getRuDate(v) : v
      })
    );
    rows.unshift(firstRow);
    const buffer = xlsx.build([{name: "1", data: HandleData.clearEmptyColumns(rows)}]);
    return Buffer.from(buffer)
  }

  checkFilteredResultForEmptyness(pers) {
    if(!pers.length) {
      ErrHandler.throw('Поиск никого не нашел')
    }
  }

  async filterContractsZipped(fltr: IServerFilter) {
    // тут часто может быть мало данных
    let pers = await this.personnelService.filter(fltr);
    this.checkFilteredResultForEmptyness(pers);
    const ids = pers.map(w => w.id);
    // лишняя работа но и лишней говнологики в фильтре нет
    pers = await Personnel.findAll({where: {id: ids}, include: [{model: Workplace, where: {active: true}}, Passport]});

    const salaries = HandleData.toKeyProp<ISalaryDict, number>(await this.dictService.getSalary(), 'value', 'salary');
    return Promise.all(
      pers.map(async (worker) => {
        HandleData.addCountedSalary(worker, salaries);
        return [
          await this.createOfficeFileUint8(new PrintExtraLaborContractDynamicBuilder().make(worker)),
          // винда только с 8 версии корректно отображает русские мена в архиве поэтому надо распаковывать например винраром
          HandleData.getFIO([worker.surname, worker.name, worker.middleName], false) + ' ' + worker.id
        ]})
    ).then((all) => this.putDataToZip(all, '.docx')
    ).then(Buffer.from)

  }

  async filterContracts(fltr: IServerFilter) {
    // тут часто может быть мало данных
    let pers = await this.personnelService.filter(fltr);
    this.checkFilteredResultForEmptyness(pers);
    const ids = pers.map(w => w.id);
    // лишняя работа но и лишней говнологики в фильтре нет
    pers = await Personnel.findAll({where: {id: ids}, include: [{model: Workplace, where: {active: true}}, Passport]});

    const salaries = HandleData.toKeyProp<ISalaryDict, number>(await this.dictService.getSalary(), 'value', 'salary');
    pers.forEach((worker) => {
      HandleData.addCountedSalary(worker, salaries);
    });
    const allDocs = await this.createOfficeFileUint8(new PrintExtraLaborContractDynamicBuilder().makeMoreThanOne(pers));

    return Buffer.from(<any>allDocs)/*Promise.all(

    ).then(() => {

      return this.createOfficeFileUint8()
    })
    ).then(Buffer.from)*/

  }

  async putDataToZip(all: any[], ext) {
    let zip = new jszip();
    all.forEach(([file,fileName], i) => zip.file(fileName + ext, file));
    return await zip.generateAsync({type: 'uint8array'})
  }
}
