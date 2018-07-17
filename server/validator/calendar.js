import validator from '../component/validator';
import { userValidate } from './user';


class CalendarValidate {
  async duration(body, user) {
    const errorList = validator.check(body, {
      startDate: {
        isDate: {
          message: 'Start date is required',
        },
      },
      endDate: {
        isDate: {
          message: 'End date is required',
        },
      },
    });

    if (errorList.length) {
      throw (errorList);
    }

    const userObj = await userValidate.checkForHousehold(user._id);

    return {
      userObj,
      body,
    };
  }
}

export default CalendarValidate;

export const calendarValidate = new CalendarValidate();
