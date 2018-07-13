import udidWrite from '../model/write/udid';
import validator from '../component/validator';
// import { userValidate } from './user';

class UiidValidate {
  async create(body, userId) {
    const errorList = validator.check(body, {
      token: {
        notEmpty: {
          message: 'Token should not be empty.',
        },
      },
    });

    if (errorList.length) {
      throw errorList;
    }

    // await userValidate.checkForHousehold(userId);

    // const taskNameObj = await taskWrite.findByName(body.name);

    // if (taskNameObj) {
    //   throw [{ param: 'name', message: 'Name is already exists' }];
    // }

    return body.token;
  }
}

export default new UiidValidate();
