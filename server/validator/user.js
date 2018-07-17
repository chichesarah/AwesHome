import _ from 'lodash';
import fs from 'fs';

import userWrite from '../model/write/user';
import validator from '../component/validator';
import { userAction } from '../action/user';

const userFreeData = [
  '_id',
  'email',
  'firstName',
  'lastName',
  'identities',
  'avatar',
  'newAvatar',
  'avatarId',
  'birthday',
  'phone',
  'removeAvatar',
  'isRegisterAnswers',
  'householdId',
  'notification',
];

class UserValidate {
  async registerAnswers(body, user) {
    const errorList = validator.check(body.fields, {
      roommatesCount: {
        isInt: {
          message: 'Valid roommatesCount is required',
        },
      },
      placeId: {
        notEmpty: {
          message: 'Valid placeId is required',
        },
      },
    });

    if (errorList.length) {
      throw (errorList);
    }

    if (body.files && body.files.avatar) {
      if (!fs.existsSync(body.files.avatar.path)) {
        throw ([{ param: 'avatar', message: 'Upload error' }]);
      }
    }

    const userObj = await userWrite.findRow({
      query: {
        _id: user._id,
        isDeleted: false,
      },
    });

    if (!userObj) {
      throw ([{ param: 'email', message: 'User not found' }]);
    }

    const googleAddress = await userAction.getGoogleAddress(body.fields.placeId);

    const errorAddressList = validator.check(googleAddress, {
      streetNumber: {
        notEmpty: {
          message: 'Valid streetNumber is required',
        },
      },
      route: {
        notEmpty: {
          message: 'Valid route is required',
        },
      },
      city: {
        notEmpty: {
          message: 'Valid city is required',
        },
      },
      zip: {
        notEmpty: {
          message: 'Valid zip code is required',
        },
      },
      state: {
        notEmpty: {
          message: 'Valid state is required',
        },
      },
      fullAddress: {
        notEmpty: {
          message: 'Valid state is required',
        },
      },
    });

    if (errorAddressList.length) {
      throw (errorAddressList);
    }

    return {
      userObj,
      googleAddress,
      fields: _.pick(body.fields, ['roommatesCount', 'placeId']),
      files: _.pick(body.files, ['avatar']),
    };
  }

  async update(body) {
    const fullValidateObj = {
      email: {
        isEmail: {
          message: 'Valid email is required',
        },
      },
      firstName: {
        notEmpty: {
          message: 'First Name is required',
        },
      },
      lastName: {
        notEmpty: {
          message: 'Last Name is required',
        },
      },
      birthday: {
        isDate: {
          message: 'Valid birthday is required',
        },
      },
      removeAvatar: {
        isBoolean: {
          message: 'Valid removeAvatar is required',
        },
      },
      notification: {
        isBoolean: {
          message: 'Valid notification is required',
        },
      },
      phone: {
        isMobilePhone: {
          locale: 'any',
          message: 'Valid phone is required',
        },
      },
    };

    const validateObj = {};

    for (let field in fullValidateObj) {
      if (!_.isUndefined(body.fields[field]) && fullValidateObj[field]) {
        validateObj[field] = fullValidateObj[field];
      }
    }

    const errorList = validator.check(body.fields, validateObj);
    if (errorList.length) {
      throw (errorList);
    }

    if (body.files && body.files.avatar) {
      if (!fs.existsSync(body.files.avatar.path)) {
        throw ([{ param: 'avatar', message: 'Upload error' }]);
      }
    }

    return {
      fields: _.pick(body.fields, userFreeData),
      files: _.pick(body.files, userFreeData),
    };
  }

  async checkForHousehold(userId) {
    const userObj = await userWrite.findRow({
      query: {
        _id: userId,
        isDeleted: false,
      },
    });

    if (!userObj) {
      throw ([{ param: 'userId', message: 'User not found' }]);
    }

    if (!userObj.householdId) {
      throw ([{ param: 'userId', message: 'User do not have household' }]);
    }

    return userObj;
  }
}


export default UserValidate;

export const userValidate = new UserValidate();
