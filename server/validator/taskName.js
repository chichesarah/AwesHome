import taskWrite from '../model/write/taskName';
import validator from '../component/validator';
import { userValidate } from './user';

class TaskNameValidate {
  async create(body, userId) {
    const validateObj = {
      name: {
        notEmpty: {
          message: 'Name should not be empty.',
        },
      },
    };

    const errorList = validator.check(body, validateObj);

    if (errorList.length) {
      throw errorList;
    }

    await userValidate.checkForHousehold(userId);

    const taskNameObj = await taskWrite.findByName(body.name);

    if (taskNameObj) {
      throw [{ param: 'name', message: 'Name is already exists' }];
    }

    return body.name;
  }
}

export default new TaskNameValidate();
