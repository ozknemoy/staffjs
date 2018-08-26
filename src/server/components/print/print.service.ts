import {Component} from "@nestjs/common";
import {PersonnelService} from "../personnel/personnel.service";
const path = require('path');

const fontDescriptors = {
  Roboto: {
    normal: path.join(__dirname, '../../fonts/Roboto-Regular.ttf'),
    bold: path.join(__dirname, '../../fonts/Roboto-Medium.ttf'),
    italics: path.join(__dirname, '../../fonts/Roboto-Italic.ttf'),
    bolditalics: path.join(__dirname, '../../fonts/Roboto-MediumItalic.ttf')
  }
};

var PdfPrinter = require('pdfmake');
console.log('***********',__dirname);
var printer = new PdfPrinter(fontDescriptors);


const docDefinition = {
  content: [
    'This is a standard paragraph, using default style',
    { text: 'This paragraph will have a bigger font', fontSize: 15 },
    {text: [
        'This paragraph is defined as an array of elements to make it possible to ',
        { text: 'restyle part of it and make it bigger ', fontSize: 15 },
        'than the rest.'
      ]
    }
  ]
};

@Component()
export class PrintService {

  constructor(private personnelService: PersonnelService) {

  }

  async printT2(userId) {
    //const user = this.personnelService.getOne(userId);
    return this.createPdfBinary(function(binary) {
      //res.contentType('application/pdf');
      return (binary);
    }/*, function(error) {
      return ('ERROR:' + error);
    }*/);
    // return await printer.createPdfKitDocument(docDefinition);


  }

  createPdfBinary(callback) {


    return new Promise((res) => {
      var doc = printer.createPdfKitDocument(docDefinition);

      var chunks = [];
      var result;

      doc.on('data', function (chunk) {
        chunks.push(chunk);
      });
      doc.on('end', function () {
        result = Buffer.concat(chunks);
        res(callback('data:application/pdf;base64,' + result.toString('base64')));
      });
      doc.end();
    })


  }


}
