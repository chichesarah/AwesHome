import sharedListWrite from '../model/write/sharedList';
import userWrite from '../model/write/user';
import validator from '../component/validator';
import { userValidate } from './user';

class SharedListValidate {
  async create(body, userId) {
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

    const members = await userWrite.checkMembers(body.member, userObj.householdId);

    if (members.length !== body.member.length) {
      throw ([{ param: 'member', message: 'Not all users have been found in your household' }]);
    }

    const sharedListName = await sharedListWrite.findByName(body.name);

    if (sharedListName) {
      throw ([{ param: 'name', message: 'This name is already exists' }]);
    }

    body.member.push(userId);

    return body;
  }
}

export default new SharedListValidate();
