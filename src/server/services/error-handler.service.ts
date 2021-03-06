import {ForbiddenException, HttpException, HttpStatus} from "@nestjs/common";
import {UniqueConstraintError} from "sequelize";
import {logger} from "../utils/logger";

export class ErrHandler {

  public STATUS_FOR_VALID_AND_UNIQUE_ERR = HttpStatus.NOT_ACCEPTABLE;

  static throw(err: string, code = HttpStatus.NOT_ACCEPTABLE) {
    logger.error(err);
    throw new HttpException(err, code);
  }

  // следущте 2 метода должны использоваться совместно один в другом
  // потомок у catchPropagate
  static propagate(message, e: Error) {
    throw {message, propagate: true}
  }
  // родитель у propogate
  static catchPropagate(message, e: Error) {
    ErrHandler.throw(e['propagate'] ? e.message : message)
  }
  // пока простое преобразование в массив ошибок  вложенность в errors
  handle(err: any, code = this.STATUS_FOR_VALID_AND_UNIQUE_ERR) {
    /* если передавать не массив ошибки а строку то преобразуется в объект
       https://docs.nestjs.com/exception-filters
       если послать строку то отправится
    {
      "statusCode": 403,
      "message": "string"
    }
    если объект то он перезапишет этот объект
    */
    // сначала пытаюсь выдернуть message из объекта

    let e = err && typeof err === 'object' && err.message ? err.message : err;
    console.log(e);
    // на фронте нужен массив()
    e = Array.isArray(err) && err.length ? e.split(';') : e;
    e = e
      .replace(/(,)/g, ';')
      .replace(/(Validation error:)/g, '');
    logger.error(e);
    throw new HttpException(e, code);
  }

  handlaAll(e, tableName?, uniqueFields?: /*{email:'Email уже существует'}*/Object, status = this.STATUS_FOR_VALID_AND_UNIQUE_ERR) {
    console.log('handleAllErr___________________', e.name);
    switch (e.name) {
      case "SequelizeUniqueConstraintError":
        for (const key in uniqueFields) {
          // сравниваю с tableName + '_email_......'
          if (e.parent.constraint.indexOf(`${tableName}_${key}_`) >= 0) {
            return this.handle(uniqueFields[key], status);
          }
        }
        break;
      case 'SequelizeDatabaseError': {
        return this.handle('ошибка БД: ' + (e.parent ? e.parent.toString() : ''), HttpStatus.BAD_REQUEST)
      }
      case 'SequelizeValidationError':
        return this.handle(e, status);
    }
    return this.handle(e, status)
  }

}
