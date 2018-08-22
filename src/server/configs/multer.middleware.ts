import {Middleware, NestMiddleware, RequestMethod} from '@nestjs/common';

import * as fs from 'fs';
import {IFileUpload} from '../interfaces/file-upload';

const multer = require('multer');
export const MULTER_PARENT_DIR_LOCAL = '/upload';
export const MULTER_DIR_LOCAL = MULTER_PARENT_DIR_LOCAL + '/document/';
export const MULTER_PARENT_DIR = __dirname + '/../../..' + MULTER_PARENT_DIR_LOCAL;
export const MULTER_DIR = MULTER_PARENT_DIR + '/document/';

if (!fs.existsSync(MULTER_PARENT_DIR)) {
  fs.mkdir(MULTER_PARENT_DIR, () => {});
}
if (!fs.existsSync(MULTER_DIR)) {
  fs.mkdir(MULTER_DIR, () => {});
}

const storage = multer.diskStorage({
  destination: function (req, file: IFileUpload, cb) {
    cb(null, MULTER_DIR);
  },
  filename: function (req, file: IFileUpload, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});


export const MULTER_ROUTES: { path: string, method: string, url?: string }[] = <any>[
  {path: '/upload/personnel', method: RequestMethod.POST},
  {path: '/profiles/document/files', method: RequestMethod.POST}
];

@Middleware()
export class MulterMiddleware implements NestMiddleware {
  resolve(): (req, res, next) => void {
    const upload = multer({storage: storage});
    return upload.any();
  }
}