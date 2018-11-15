import {ForbiddenException, HttpException, HttpStatus} from "@nestjs/common";
import {UniqueConstraintError} from "sequelize";

export class ErrHandler {

  public STATUS_FOR_VALID_AND_UNIQUE_ERR = HttpStatus.NOT_ACCEPTABLE;

  static throw(err: string, code = HttpStatus.NOT_ACCEPTABLE) {
    throw new HttpException(err, code);
  }

  static propogate(message, e: Error) {
    console.log(e);
    throw {message, propagate: true}
  }

  static catchPropagate(message, e: Error) {
    if (!e['propagate']) {
      console.log(e);
    }
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
    // на фронте нужен массив()
    e = Array.isArray(err) && err.length ? e.split(';') : e;
    throw new HttpException(e, code);
  }

  /*is like SequelizeValidationError*/
  handleErrors(err) {
    return this.handle(err.errors.map(e => e.message), this.STATUS_FOR_VALID_AND_UNIQUE_ERR)
  }

  handlaAll(e, tableName?, uniqueFields?: /*{email:'Email уже существует'}*/Object, status = this.STATUS_FOR_VALID_AND_UNIQUE_ERR) {
    console.log('ErrHandler.handleAll___________________', e.name);
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
        return this.handleErrors(e);
    }
    return this.handle(e, status)
  }

}
