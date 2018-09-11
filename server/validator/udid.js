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
      type: {
        isIn: {
          values: ['ios', 'android'],
          message: 'Valid type is required',
        },
      },
    });

    if (errorList.length) {
      throw errorList;
    }

    return body;
  }

  async update(body, userId) {
    const errorList = validator.check(body, {
      oldToken: {
        notEmpty: {
          message: 'Old token is required',
        },
      },
      newToken: {
        notEmpty: {
          message: 'New token is required.',
        },
      },
      type: {
        isIn: {
          values: ['ios', 'android'],
          message: 'Valid type is required',
        },
      },
    });

    if (errorList.length) {
      throw errorList;
    }

    const udidObj = await udidWrite.findUdidByToken(body.oldToken);

    if (!udidObj) {
      throw ([{ param: 'id', message: 'This udid not found' }]);
    }

    if (udidObj.token.toString() === body.newToken.toString()) {
      throw ([{ param: 'newToken', message: 'This token already exists' }]);
    }

    if (udidObj.userId.toString() !== userId.toString()) {
      throw ([{ param: 'userId', message: 'You can not update this udid, have not permissions' }]);
    }

    return Object.assign(udidObj, { newToken: body.newToken });
  }

  async delete(params) {
    const errorList = validator.check(params, {
      id: {
        isMongoId: {
          message: 'Udid id is incorrect',
        },
      },
    });

    if (errorList.length) {
      throw errorList;
    }

    const udidObj = await udidWrite.findUdidById(params.id);

    if (!udidObj) {
      throw ([{ param: 'id', message: 'This udid not found' }]);
    }

    return params.id;
  }
}

export default new UdidValidate();
