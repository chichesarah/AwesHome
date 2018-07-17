import udidWrite from '../model/write/udid';
import validator from '../component/validator';

class UdidValidate {
  async create(body) {
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

    return body.token;
  }

  async delete(param, userId) {
    const errorList = validator.check(param, {
      id: {
        isMongoId: {
          message: 'Udid id is incorect',
        },
      },
    });

    if (errorList.length) {
      throw errorList;
    }

    const udidObj = await udidWrite.findUdidById(param.id);

    if (!udidObj) {
      throw ([{ param: 'id', message: 'This udid not found' }]);
    }

    if (udidObj.userId.toString() !== userId.toString()) {
      throw ([{ param: 'userId', message: 'You can not delete this udid, have not permissions' }]);
    }

    return param.id;
  }
}

export default new UdidValidate();
