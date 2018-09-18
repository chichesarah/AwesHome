import moment from 'moment';
import _ from 'lodash';
import userWrite from '../model/write/user';
import eventWrite from '../model/write/event';
import validator from '../component/validator';
import { userValidate } from './user';

const eventFreeData = [
  '_id',
  'title',
  'startDate',
  'endDate',
  'fullAddress',
  'notify',
  'ownerId',
  'allDay',
  'member',
  'householdId',
];

class EventValidate {
  async getOne(param) {
    const errorList = validator.check(param, {
      id: {
        isMongoId: {
          message: 'Id is incorrect.',
        },
      },
    });

    if (errorList.length) {
      throw errorList;
    }

    const event = await eventWrite.findEventById(param.id);

    if (!event) {
      throw ([{ param: 'id', message: 'Event not found' }]);
    }

    return event;
  }

  async create(body, userId) {
    if (body.member) {
      body.member = body.member.filter(i => i.trim());
    }

    const fullValidateObj = {
      title: {
        notEmpty: {
          message: 'Title should not be empty.',
        },
      },
      member: {
        notEmpty: {
          message: 'Member should not be empty.',
        },
      },
      startDate: {
        isDate: {
          message: 'Start date shoud not be empty.',
        },
      },
      allDay: {
        isBoolean: {
          message: 'Invalid `allDay` field.',
        },
      },
      endDate: {
        isDate: {
          message: 'End date shoud not be empty.',
        },
      },
      fullAddress: {
        notEmpty: {
          message: 'Full address shoud not be empty.',
        },
      },
    };

    const validateObj = {};

    Object.keys(fullValidateObj).forEach((field) => {
      if (!_.isUndefined(body[field]) && fullValidateObj[field]) {
        validateObj[field] = fullValidateObj[field];
      }
    });

    const errorList = validator.check(body, validateObj);

    if (errorList.length) {
      throw errorList;
    }

    const ownerObj = await userValidate.checkForHousehold(userId);

    if (body.member) {
      const members = await userWrite.checkMembers(body.member, ownerObj.householdId);

      if (members.length !== body.member.length) {
        throw ([{ param: 'member', message: 'Not all members from the same household' }]);
      }
    }

    if (moment(body.startDate).isBefore(moment())) {
      throw ([{ param: 'startDate', message: 'Start date already passed' }]);
    }

    if (moment(body.startDate).isAfter(body.endDate)) {
      throw ([{ param: 'startDate', message: 'Start date can not be after the end date' }]);
    }

    body.ownerId = userId;
    body.householdId = ownerObj.householdId;

    return _.pick(body, eventFreeData);
  }

  async delete(param, userId) {
    const errorList = validator.check(param, {
      id: {
        isMongoId: {
          message: 'Id is incorrect.',
        },
      },
    });

    if (errorList.length) {
      throw errorList;
    }

    const event = await eventWrite.findEventById(param.id);

    if (!event) {
      throw ([{ param: 'id', message: 'Event not found' }]);
    }

    // if (event.ownerId.toString() !== userId.toString()) {
    //   throw ([{ param: 'userId', message: 'User can not delete this event, don\'t have permission' }]);
    // }

    return event;
  }

  async update(body, param, userId) {
    body._id = param.id;

    if (body.member) {
      body.member = body.member.filter(i => i.trim());
    }

    const fullValidateObj = {
      _id: {
        isMongoId: {
          message: 'Id is incorrect.',
        },
      },
      title: {
        notEmpty: {
          message: 'Title should not be empty.',
        },
      },
      startDate: {
        isDate: {
          message: 'Start date shoud not be empty.',
        },
      },
      endDate: {
        isDate: {
          message: 'End date shoud not be empty.',
        },
      },
      fullAddress: {
        notEmpty: {
          message: 'Full address shoud not be empty.',
        },
      },
      allDay: {
        isBoolean: {
          message: 'Invalid `allDay` field.',
        },
      },
      member: {
        notEmpty: {
          message: 'Member should not be empty.',
        },
      },
    };

    const validateObj = {};

    for (const field in fullValidateObj) {
      if (!_.isUndefined(body[field]) && fullValidateObj[field]) {
        validateObj[field] = fullValidateObj[field];
      }
    }

    const errorList = validator.check(body, validateObj);

    if (errorList.length) {
      throw errorList;
    }

    const event = await eventWrite.findEventById(param.id);

    if (!event) {
      throw ([{ param: 'id', message: 'Event not found' }]);
    }

    // if (event.ownerId.toString() !== userId.toString()) {
    //   throw ([{ param: 'userId', message: 'User can not update this event, don\'t have permission' }]);
    // }

    const userObj = await userValidate.checkForHousehold(userId);

    if (body.member) {
      const members = await userWrite.checkMembers(body.member, userObj.householdId);

      if (members.length !== body.member.length) {
        throw ([{ param: 'member', message: 'Not all members from the same household' }]);
      }
    }

    return _.pick(body, eventFreeData);
  }

  async addGuest(body) {
    if (body.member) {
      body.member = body.member.filter(i => i.trim());
    }

    const errorList = validator.check(body, {
      member: {
        notEmpty: {
          message: 'Member should not be empty.',
        },
      },
      eventId: {
        isMongoId: {
          message: 'Id is incorrect.',
        },
      },
    });

    if (errorList.length) {
      throw errorList;
    }

    return body;
  }
}

export default new EventValidate();
