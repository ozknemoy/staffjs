
export class DbTransactions {

  // при данной реализации надо обязательно возвращать на фронт объект и писать его в модель чтобы сохранялись id
  async createOrUpdateRel<T>(SubModel, fk: string, id: number, propRels: keyof T, newParentValue: T) {
    const relNewValue  = <any>newParentValue[propRels];
    // если связь -to-one то эмулирую -to-many
    //const relNewValue: any[] = (_relNewValue && !Array.isArray(_relNewValue)) ? [_relNewValue] : <any>_relNewValue;

    const subModelOld = await SubModel['findAll']({where: {[fk]: id}});
    if (newParentValue && relNewValue && relNewValue.length) {
      // update
      if (subModelOld && subModelOld.length) {
        // find already used
        return Promise.all(relNewValue.map(rowForSave => {
          // тут привязка на то что у новых элементов нет id
          if (rowForSave.id) {
            return subModelOld.find(oneSubModel => rowForSave.id === oneSubModel.id).update(rowForSave)
          }
          return SubModel.create({...rowForSave, ...{[fk]: id}})
        })).then(() => {
          // надо проверить удалялись ли строки
          // просто проверяю есть ли у старых id которых уже нет в новом
          const subValuesForDelete = subModelOld.filter(old => !relNewValue.find(sub => old.id === sub.id));
          if (subValuesForDelete && subValuesForDelete.length) {
            return SubModel['destroy']({where: {id: subValuesForDelete.map(sub => sub.id)}})
          }
          return Promise.resolve(null)
        })
      }
      // create
      return SubModel.bulkCreate(relNewValue.map(one => ({...one, ...{[fk]: id}})))
    }
    if (subModelOld && subModelOld.length) {
      return SubModel['destroy']({where: {[fk]: id}});
    }
    return Promise.resolve(null)
  }

  // для моделей Many без взаимосвязей
  async createOrUpdateManyWithoutRels(_Model, fk: string, parentId: number, newValue: any[]) {
    const modelOld = await _Model['findAll']({where: {[fk]: parentId}});
    if (newValue && newValue.length) {
      // update
      if (modelOld && modelOld.length) {
        // find already used
        return Promise.all(newValue.map(rowForSave => {
          // тут привязка на то что у новых элементов нет id
          if (rowForSave.id) {
            return modelOld.find(oneSubModel => rowForSave.id === oneSubModel.id).update(rowForSave)
          }
          return _Model.create({...rowForSave, ...{[fk]: parentId}})
        })).then(() => {
          // надо проверить удалялись ли строки
          // просто проверяю есть ли у старых id которых уже нет в новом
          const subValuesForDelete = modelOld.filter(old => !newValue.find(sub => old.id === sub.id));
          if (subValuesForDelete && subValuesForDelete.length) {
            return _Model['destroy']({where: {id: subValuesForDelete.map(sub => sub.id)}})
          }
          return Promise.resolve(null)
        })
      }
      // create
      return _Model.bulkCreate(newValue.map(one => ({...one, ...{[fk]: parentId}})))
    }
    if (modelOld && modelOld.length) {
      return _Model['destroy']({where: {[fk]: parentId}});
    }
    return Promise.resolve(null)
  }

  /* начал реализовывать но пока бросил
  async createOrUpdateManyWithRelOneToOne(newValues: any[], _Model, SubModel, propRels: string, fk: string) {

    return Promise.all([
      newValues.map(newParentValue => {
        // update
        if (newParentValue.id) {
          return _Model.findById(newParentValue.id)
            .then(oldModel => oldModel.update(newParentValue))
            .then(() => this.createOrUpdateRel(SubModel, fk, newParentValue.id, propRels, newParentValue))
        }

      })
    ]);
  }*/

}
