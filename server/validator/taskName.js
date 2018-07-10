import taskWrite from '../model/write/taskName';
import validator from '../component/validator';

class TaskNameValidate {
  async create(body) {
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

    const taskNameObj = await taskWrite.findByName(body.name);

    if (taskNameObj) {
      throw [{ param: 'name', message: 'Name is already exists' }];
    }

    return body.name;
  }
}

export default new TaskNameValidate();
