import _ from 'lodash';

import taskWrite from '../model/write/task';
import eventWrite from '../model/write/event';
import { convertDataUtc, countNextDate } from './task';

class CalendarAction {
  async getTasks(data, fullResponse = false) {

    const userData = _.cloneDeep(data.userObj);

    const startDate = convertDataUtc(data.body.startDate);
    let endDate = convertDataUtc(data.body.endDate);

    const tasks = await taskWrite.getTasksByDuration({
      householdId: userData.householdId,
      startDate,
      endDate,
    });

    const calendar = {};

    tasks.forEach((task) => {
      let nextDate = convertDataUtc(task.dueDate);

      const taskEndDate = task.endDate ? convertDataUtc(task.endDate) : endDate;
      endDate = taskEndDate < endDate ? taskEndDate : endDate;

      while (nextDate < startDate && task.repeat !== 'not repeat') {
        nextDate = countNextDate(nextDate, task.repeat);
      }

      while (nextDate < endDate) {
        const date = nextDate.format('YYYY-MM-DD');

        const taskObject = {
          _id: task._id,
          type: 'task',
        };

        if (fullResponse) {
          taskObject.object = task;
        }

        if (!calendar[date]) {
          calendar[date] = [taskObject];
        } else {
          calendar[date].push(taskObject);
        }

        if (task.repeat === 'not repeat') {
          break;
        }

        nextDate = countNextDate(nextDate, task.repeat);
      }
    });

    return calendar;
  }

  async getAllEvent(data, prevCalendar = {}, fullResponse = false) {
    const userData = _.cloneDeep(data.userObj);

    const startDate = convertDataUtc(data.body.startDate);
    const endDate = convertDataUtc(data.body.endDate);

    const events = await eventWrite.getEventByDuration({
      householdId: userData.householdId,
      startDate,
      endDate,
    });

    const calendar = _.assignIn({}, prevCalendar);

    events.forEach((event) => {
      let nextDate = convertDataUtc(event.startDate);
      let eventEndDate = convertDataUtc(event.endDate);

      eventEndDate = eventEndDate.isBefore(endDate) ? eventEndDate : endDate;

      while (nextDate.isBefore(startDate)) {
        nextDate = nextDate.add(1, 'd');
      }

      while (eventEndDate.isAfter(nextDate) || eventEndDate.isSame(nextDate)) {
        const date = nextDate.format('YYYY-MM-DD');

        const eventObject = {
          _id: event._id,
          type: 'event',
        };

        if (fullResponse) {
          eventObject.object = event;
        }

        if (!calendar[date]) {
          calendar[date] = [eventObject];
        } else {
          calendar[date].push(eventObject);
        }
        nextDate = nextDate.add(1, 'd');
      }
    });

    return calendar;
  }
}

export default CalendarAction;

export const calendarAction = new CalendarAction();
