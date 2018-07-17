import _ from 'lodash';

import taskWrite from '../model/write/task';
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

      while (nextDate < startDate) {
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
}

export default CalendarAction;

export const calendarAction = new CalendarAction();
