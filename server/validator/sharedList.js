import sharedListWrite from '../model/write/sharedList';
import userWrite from '../model/write/user';
import validator from '../component/validator';

class SharedListValidate {
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

    const userObj = await userWrite.findRow({
      query: {
        _id: userId,
        isDeleted: false,
      },
    });

    const members = await userWrite.checkMembers(body.member, userObj.householdId);

    if (members.length !== body.member.length) {
      throw ([{ param: 'member', message: 'Not all users have been found in your household' }]);
    }

    body.member.push(userId);

    return body;
  }
}

export default new SharedListValidate();
