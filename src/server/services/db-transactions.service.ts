
export class DbTransactions {

  // при данной реализации надо обязательно возвращать на фронт объект и писать его в модель чтобы сохранялись id
  async createOrUpdateRel(SubModel, fk: string, id: number, propRels: string, newParentValue: Object) {
    const relNewValue = newParentValue[propRels];
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

}
