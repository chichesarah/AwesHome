import _ from 'lodash';
import moment from 'moment';

import taskWrite from '../model/write/task';
import eventWrite from '../model/write/event';
import { convertDataUtc, countNextDate, timeDiff } from './task';

class CalendarAction {
  async getTasks(data, fullResponse = false) {
    const userData = _.cloneDeep(data.userObj);

    const startDate = convertDataUtc(data.body.startDate);
    const endDate = convertDataUtc(data.body.endDate);

    const tasks = await taskWrite.getTasksByDuration({
      householdId: userData.householdId,
      startDate,
      endDate,
    });

    const calendar = {};

    tasks.forEach((task) => {
      let nextDate = convertDataUtc(task.createdAt);

      let taskEndDate = convertDataUtc(task.dueDate);
      taskEndDate = taskEndDate.isBefore(endDate) ? taskEndDate : endDate;

      while (
        nextDate.isBefore(startDate) &&
        task.repeat !== 'Does not repeat'
      ) {
        nextDate = countNextDate(nextDate, task.repeat);
      }

      while (nextDate.isBefore(taskEndDate) || nextDate.isSame(taskEndDate)) {
        const date = nextDate.format('YYYY-MM-DD');

        const taskObject = {
          _id: task._id,
          type: 'task',
        };

        if (fullResponse) {
          const taskObj = _.cloneDeep(task);

          if (taskObj.rotate) {
            const startIndexDate = convertDataUtc(taskObj.createdAt);
            let diff;
            let currentIndex;

            if (taskObj.repeat === 'Every 2 weeks') {
              diff = nextDate.diff(startIndexDate, 'week');

              const twiceDiff = diff * 2;
              currentIndex =
                (twiceDiff + taskObj.startIndex) % taskObj.assignee.length;
            } else {
              diff = nextDate.diff(startIndexDate, timeDiff(taskObj.repeat));

              currentIndex =
                (diff + taskObj.startIndex) % taskObj.assignee.length;
            }

            const currentMember = taskObj.assignee.filter(
              (member, index) => index === currentIndex,
            );
            taskObj.currentMember = currentMember;
          }

          taskObj.nextDate = nextDate;
          taskObject.object = taskObj;
        }

        if (!calendar[date]) {
          calendar[date] = [taskObject];
        } else {
          calendar[date].push(taskObject);
        }

        if (task.repeat === 'Does not repeat') {
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
