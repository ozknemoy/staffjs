import {HttpException, HttpStatus} from "@nestjs/common";
import {UniqueConstraintError} from "sequelize";

export class ErrHandler {

  public STATUS_FOR_VALID_AND_UNIQUE_ERR = HttpStatus.NOT_ACCEPTABLE;

  // пока простое преобразование в массив ошибок  вложенность в errors
  handle(err: string | string[], code = this.STATUS_FOR_VALID_AND_UNIQUE_ERR) {
    let body = {errors: {}};
    if (Array.isArray(err)) {
      err.forEach((e, i) => body.errors['dummi' + i] = [e])

    } else {
      body.errors = err;
    }

    throw new HttpException(body, code);
  }

  /*is like SequelizeValidationError*/
  sentToFront(err) {
    return this.handle(err.errors.map(e => e.message), this.STATUS_FOR_VALID_AND_UNIQUE_ERR)
  }

  sendForbidden() {
    return this.handle('Не хватает прав', HttpStatus.FORBIDDEN)
  }

  handlaAll(e, tableName, uniqueFields, status = this.STATUS_FOR_VALID_AND_UNIQUE_ERR) {
    switch (e.name) {
      case "SequelizeUniqueConstraintError":
        // отдаю поля uniqueFields={email:'Email уже существует'}
        for (const key in uniqueFields) {
          // сравниваю с tableName + '_email_......'
          if (e.parent.constraint.indexOf(`${tableName}_${key}_`) >= 0) {
            return this.handle(uniqueFields[key], status);
          }
        }
        break;
      case 'SequelizeValidationError':
        return this.sentToFront(e);
    }
    return this.handle('Не хватает прав', status)

  }


}

