import _ from 'lodash';

import householdWrite from '../model/write/household';
import validator from '../component/validator';
import { userValidate } from './user';

const householdFreeData = [
  '_id',

  'addressLine',
  'city',
  'zip',
  'state',
  'fullAddress',

  'createdAt',
  'updatedAt',
  'isDeleted',
];

class HouseholdValidate {
  async connect(body, user) {
    const errorList = validator.check(body, {
      _id: {
        isMongoId: {
          message: 'Invalid household id',
        },
      },
    });

    if (errorList.length) {
      throw (errorList);
    }

    const householdObj = await householdWrite.findById(body._id);

    if (!householdObj) {
      throw ([{ param: 'householdId', message: 'Household not found' }]);
    }

    const userObj = await userValidate.checkUser(user._id);

    if (userObj.householdId) {
      throw ([{ param: 'householdId', message: 'Before join the household you must leave the current one.' }]);
    }

    return {
      userObj,
      householdObj,
    };
  }

  async leave(user) {
    const userObj = await userValidate.checkUser(user._id);

    if (!userObj.householdId) {
      throw ([{ param: 'accessToken', message: 'User is not connected to the household' }]);
    }

    return userObj;
  }

  async checkHousehold(user) {
    const userObj = await userValidate.checkForHousehold(user._id);

    const householdObj = await householdWrite.findById(userObj.householdId);

    if (!householdObj) {
      throw ([{ param: 'householdId', message: 'Household not found' }]);
    }

    return householdObj;
  }

  async update(body, user) {
    const fullValidateObj = {
      addressLine: {
        notEmpty: {
          message: 'Valid addressLine is required',
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
    };

    const validateObj = {};

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

    const householdObj = await householdWrite.findById(userObj.householdId);

    if (!householdObj) {
      throw ([{ param: 'householdId', message: 'Household not found' }]);
    }

    return {
      body,
      householdObj: _.pick(householdObj, householdFreeData),
    };
  }
}

export default HouseholdValidate;

export const householdValidate = new HouseholdValidate();
