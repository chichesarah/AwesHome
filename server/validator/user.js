import userWrite from '../model/write/user';

import validator from '../component/validator';

import * as _ from 'lodash';
import fs from 'fs';

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
];

class UserValidate {
  async update(body, user) {

    const validateObj = {
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
    };

    let errorList = validator.check(body.fields, validateObj);

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

    if (!_.isUndefined(body.fields.facebookId)) {
        userObj.identities.facebookId = body.fields.facebookId;
    }

    if (body.files && body.files.avatar) {
      userObj.newAvatar = body.files.avatar.path;
    }

    return _.pick(userObj, userFreeData);
  }
}


export default UserValidate;

export const userValidate = new UserValidate();
