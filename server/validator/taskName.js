import taskWrite from '../model/write/taskName';

import validator from '../component/validator';

class TaskNameValidate {
  create(body) {
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

    const taskNameObj = taskWrite.findByName({
      query: {
        name: body.name,
        isDeleted: false,
      },
    });

    if (taskNameObj) {
      throw [{ param: 'name', message: 'Name is already exists' }];
    }

    return body.name;
  }
}

export default new TaskNameValidate();
