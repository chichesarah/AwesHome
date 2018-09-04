import _ from 'lodash';

import taskWrite from '../model/write/taskName';
import validator from '../component/validator';
import { userValidate } from './user';

const taskNameFreeData = ['name', 'householdId'];

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

    const taskNameObj = await taskWrite.findByName(body.name);

    if (taskNameObj) {
      throw [{ param: 'name', message: 'Name is already exists' }];
    }

    body.householdId = null;

    return _.pick(body, taskNameFreeData);
  }

  async delete(param) {
    const errorList = validator.check(param, {
      id: {
        isMongoId: {
          message: 'Invalid task id',
        },
      },
    });

    if (errorList.length) {
      throw (errorList);
    }

    const taskNameObj = await taskWrite.findById(param.id);

    if (!taskNameObj) {
      throw ([{ param: 'taskName', message: 'Taskname not found' }]);
    }

    return taskNameObj;
  }
}

export default new TaskNameValidate();
