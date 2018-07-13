import * as _ from 'lodash';
import q from 'q';
import userWrite from '../model/write/user';
import tokenWrite from '../model/write/token';

import validator from '../component/validator';

const userFreeData = [
  'createdAt',
  'updatedAt',
  'isDeleted',
  'roles',
  '_id',
  'email',
  'firstName',
  'lastName',
  'identities',
  'avatar',
  'isRegisterAnswers',
  'householdId',
  'notification',
  'birthday',
];

class AccessValidate {

  async forgot(body) {
    const errorList = validator.check(body, {
      email: {
        isEmail: {
          message: 'Valid email is required',
        },
      },
    });

    if (errorList.length) {
      throw (errorList);
    }

    const user = await userWrite.findRow({
      query: {
        email: body.email,
        isDeleted: false,
      },
    });

    if (!user) {
      throw ([{ param: 'email', message: 'User not found' }]);
    }

    return _.pick(user, userFreeData);
  }

  async register(body) {
    const errorList = validator.check(body, {
      email: {
        isEmail: {
          message: 'Valid email is required',
        },
      },
      password: {
        isLength: {
          options: {
            min: 5,
            max: 20,
          },
          message: 'Password must be between 5-20 characters long',
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
    });


    if (errorList.length) {
      throw (errorList);
    }

    const user = await userWrite.findRow({
      query: {
        email: body.email,
        isDeleted: false,
      },
    });

    if (user && user.email === body.email) {
      throw ([{ param: 'email', message: 'There is an existing user connected to this email' }]);
    }

    return _.pick(body, ['email', 'password', 'firstName', 'lastName']);
  }

  async login(body) {
    const errorList = validator.check(body, {
      email: {
        isEmail: {
          message: 'Valid email is required',
        },
      },
      password: {
        notEmpty: {
          message: 'Valid password is required',
        },
      },
    });

    if (errorList.length) {
      throw (errorList);
    }

    const user = await userWrite.findRow({
      query: {
        email: body.email,
        isDeleted: false,
      },
    });

    if (!user) {
      throw ([{ param: 'email', message: 'User not found' }]);
    }

    if (userWrite.saltPassword(user.salt, body.password) !== user.password) {
      throw ([{ param: 'password', message: 'User password is not correct' }]);
    }

    return _.pick(user, userFreeData);
  }

  async facebook(body) {
    const errorList = validator.check(body, {
      token: {
        notEmpty: {
          message: 'Token is required',
        },
      },
    });

    if (errorList.length) {
      throw (errorList);
    }

    return body;
  }

  async refreshToken(body) {
    const errorList = validator.check(body, {
      refreshToken: {
        notEmpty: {
          message: 'Valid refresh token is required',
        },
      },
    });

    if (errorList.length) {
      throw (errorList);
    }

    const token = await tokenWrite.findRow({
      query: {
        token: body.refreshToken,
        expire: {
          $gt: new Date(),
        },
      },
    });

    if (!token) {
      throw ([{ param: 'refreshToken', message: 'User not found' }]);
    }

    return _.pick(token, ['_id', 'token', 'userId', 'expire', 'updatedAt', 'createdAt']);
  }

  async changePassword(body, user) {

    const errorList = validator.check(body, {
      password: {
        isLength: {
          options: {
            min: 5,
            max: 20,
          },
          message: 'Password must be between 5-20 characters long',
        },
      },

      oldPassword: {
        isLength: {
          options: {
            min: 5,
            max: 20,
          },
          message: 'Old password must be between 5-20 characters long'
        },
      },
    });

    if (errorList.length) {
      throw (errorList);
    }

    user = await userWrite.findRow({
      query: {
        _id: user._id,
        isDeleted: false,
      },
    });

    if (!user) {
      throw ([{ param: 'accessToken', message: 'User not found' }]);
    }

    if (!user.salt || !user.password || userWrite.saltPassword(user.salt, body.oldPassword) !== user.password) {
      throw ([{ param: 'oldPassword', message: 'User old password is not correct' }]);
    }
    return body.password;
  }

}

export default AccessValidate;

export const accessValidate = new AccessValidate();
