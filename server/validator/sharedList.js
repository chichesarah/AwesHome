import _ from 'lodash';
import sharedListWrite from '../model/write/sharedList';
import userWrite from '../model/write/user';
import validator from '../component/validator';
import { userValidate } from './user';

class SharedListValidate {
  async create(body, userId) {
    if (body.member) {
      body.member = body.member.filter(i => i.trim());
    }

    const validateObj = {
      name: {
        notEmpty: {
          message: 'Name should not be empty.',
        },
      },
      member: {
        notEmpty: {
          message: 'Member should not be empty.',
        },
      },
    };

    const errorList = validator.check(body, validateObj);

    if (errorList.length) {
      throw errorList;
    }

    const userObj = await userValidate.checkForHousehold(userId);

    if (!userObj.householdId) {
      throw ([{ param: 'userId', message: 'User do not have household' }]);
    }

    body.householdId = userObj.householdId;

    const members = await userWrite.checkMembers(body.member, userObj.householdId);

    if (members.length !== body.member.length) {
      throw ([{ param: 'member', message: 'Not all users have been found in your household' }]);
    }

    // const sharedListName = await sharedListWrite.findByName(body.name);

    // if (sharedListName) {
    //   throw ([{ param: 'name', message: 'This name is already exists' }]);
    // }

    body.member.push(userId);

    return body;
  }

  async addItem(body, userId) {
    const validateObj = {
      name: {
        notEmpty: {
          message: 'Name should not be empty.',
        },
      },
      sharedListId: {
        isMongoId: {
          message: 'sharedListId is incorrect',
        },
      },
      memberId: {
        isMongoId: {
          message: 'memberId is incorrect',
        },
      },
    };

    const errorList = validator.check(body, validateObj);

    if (errorList.length) {
      throw errorList;
    }

    const sharedListObj = await sharedListWrite.findById(body.sharedListId);

    if (!sharedListObj) {
      throw ([{ param: 'sharedList', message: 'Shared list not found' }]);
    }

    const itemIndex = _.findIndex(sharedListObj.item, i => i.name === body.name);

    if (~itemIndex) {
      throw ([{ param: 'name', message: 'Name already exists' }]);
    }

    const userIndex = _.findIndex(sharedListObj.member, i => i.toString() === userId);

    if (!~userIndex) {
      throw ([{ param: 'userId', message: 'User is not a member of shareList' }]);
    }

    const memberIndex = _.findIndex(sharedListObj.member, i => i.toString() === body.memberId);

    if (!~memberIndex) {
      throw ([{ param: 'memberId', message: 'User is not a member of shareList' }]);
    }

    return body;
  }

  async checkItem(body, userId) {
    const validateObj = {
      sharedListId: {
        isMongoId: {
          message: 'sharedListId is incorrect',
        },
      },
      itemId: {
        isMongoId: {
          message: 'itemId is incorrect',
        },
      },
      status: {
        isBoolean: {
          message: 'Status is incorrect',
        },
      },
    };

    const errorList = validator.check(body, validateObj);

    if (errorList.length) {
      throw errorList;
    }

    const sharedListObj = await sharedListWrite.findById(body.sharedListId);

    if (!sharedListObj) {
      throw ([{ param: 'sharedList', message: 'Shared list not found' }]);
    }

    const itemIndex = _.findIndex(sharedListObj.item, i => i._id.toString() === body.itemId);

    if (!~itemIndex) {
      throw ([{ param: 'itemId', message: 'Item im shared list not found' }]);
    }

    // if (sharedListObj.item[itemIndex].memberId.toString() !== userId) {
    //   throw ([{ param: 'userId', message: 'User don\'t have permission' }]);
    // }

    body.status = typeof(body.status) === 'string' ? body.status !== 'false' : body.status;
    return body;
  }

  async deleteSharedList(param, userId) {
    const errorList = validator.check(param, {
      id: {
        isMongoId: {
          message: 'sharedListId is incorrect',
        },
      },
    });

    if (errorList.length) {
      throw errorList;
    }

    const sharedListObj = await sharedListWrite.findById(param.id);

    if (!sharedListObj) {
      throw ([{ param: 'sharedList', message: 'Shared list not found' }]);
    }

    const userIndex = _.findIndex(sharedListObj.member, i => i.toString() === userId);

    if (!~userIndex) {
      throw ([{ param: 'userId', message: 'User is not a member of shareList' }]);
    }

    return sharedListObj;
  }
}

export default new SharedListValidate();
