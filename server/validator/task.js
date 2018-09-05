import _ from 'lodash';
import moment from 'moment';

import taskWrite from '../model/write/task';
import taskNameWrite from '../model/write/taskName';
import validator from '../component/validator';
import userWrite from '../model/write/user';
import { userValidate } from './user';

const taskFreeData = [
  '_id',
  'ownerId',
  'householdId',
  'taskNameId',
  'dueDate',
  'repeat',
  'reminder',
  'assignee',
  'nextDate',
  'endDate',
  'rotate',
  'startIndex',
];

const repeatValues = [
  'Does not repeat',
  'Every day',
  'Every week',
  'Every 2 weeks',
  'Every month',
  'Every year',
];

class TaskValidate {
  async create(body, user) {
    const errorList = validator.check(body, {
      taskNameId: {
        isMongoId: {
          message: 'Invalid taskName id',
        },
      },
      dueDate: {
        isDate: {
          message: 'Due date is required',
        },
      },
      repeat: {
        isIn: {
          values: repeatValues,
          message: 'Valid repeat period is required',
        },
      },
      assignee: {
        notEmpty: {
          message: 'Assignee is required',
        },
      },
      rotate: {
        isBoolean: {
          message: 'Invalid value',
        },
      },
    });

    if (errorList.length) {
      throw (errorList);
    }

    const taskNameObj = await taskNameWrite.findById(body.taskNameId);

    if (!taskNameObj) {
      throw ([{ param: 'taskNameId', message: 'Task name not found' }]);
    }

    if (moment(body.dueDate) < moment().startOf('day')) {
      throw ([{ param: 'dueDate', message: 'Invalid due date' }]);
    }

    const ownerObj = await userValidate.checkForHousehold(user._id);

    const checkHousehold = await userWrite.checkMembers(body.assignee, ownerObj.householdId);

    if (checkHousehold.length !== body.assignee.length) {
      throw ([{ param: 'assignee', message: 'Not all members from the same household' }]);
    }

    body.startIndex = Math.floor(Math.random() * body.assignee.length);

    return {
      ownerObj,
      taskNameObj,
      body: _.pick(body, taskFreeData),
    };
  }

  async update(body, user) {
    const fullValidateObj = {
      dueDate: {
        isDate: {
          message: 'Valid due date is required',
        },
      },
      repeat: {
        isIn: {
          values: repeatValues,
          message: 'Valid repeat period is required',
        },
      },
      reminder: {
        isBoolean: {
          message: 'Valid reminder is required',
        },
      },
      assignee: {
        notEmpty: {
          message: 'Assignee is required',
        },
      },
      rotate: {
        isBoolean: {
          message: 'Invalid value',
        },
      },
    };

    const validateObj = {
      taskId: {
        isMongoId: {
          message: 'Invalid task id',
        },
      },
    };

    for (let field in fullValidateObj) {
      if (!_.isUndefined(body[field]) && fullValidateObj[field]) {
        validateObj[field] = fullValidateObj[field];
      }
    }

    const errorList = validator.check(body, validateObj);
    if (errorList.length) {
      throw (errorList);
    }

    const userObj = await userValidate.checkForHousehold(user._id);

    const taskObj = await taskWrite.findByIdInHousehold(body.taskId, userObj.householdId);

    if (!taskObj) {
      throw ([{ param: 'taskId', message: 'Task not found or user permission denied' }]);
    }

    if (body.dueDate && moment(body.dueDate) < moment().startOf('day')) {
      throw ([{ param: 'dueDate', message: 'Invalid dueDate' }]);
    }

    if (body.assignee) {
      const checkHousehold = await userWrite.checkMembers(body.assignee, userObj.householdId);
      if (checkHousehold.length !== body.assignee.length) {
        throw ([{ param: 'assignee', message: 'Not all members from the same household' }]);
      }
    }

    return {
      userObj,
      taskObj: _.pick(taskObj, taskFreeData),
      body,
    };
  }

  async delete(body, user) {
    const errorList = validator.check(body, {
      _id: {
        isMongoId: {
          message: 'Invalid task id',
        },
      },
    });

    if (errorList.length) {
      throw (errorList);
    }

    const userObj = await userValidate.checkForHousehold(user._id);

    const taskObj = await taskWrite.findByIdInHousehold(body._id, userObj.householdId);

    if (!taskObj) {
      throw ([{ param: 'taskId', message: 'Task not found or user permission denied' }]);
    }

    return body._id;
  }

  async complete(body, user) {
    const errorList = validator.check(body, {
      _id: {
        isMongoId: {
          message: 'Invalid task id',
        },
      },
    });

    if (errorList.length) {
      throw (errorList);
    }

    const userObj = await userValidate.checkForHousehold(user._id);

    const taskObj = await taskWrite.findByIdInHousehold(body._id, userObj.householdId);

    if (!taskObj) {
      throw ([{ param: 'taskId', message: 'Task not found or user permission denied' }]);
    }

    return body._id;
  }
}

export default TaskValidate;

export const taskValidate = new TaskValidate();
