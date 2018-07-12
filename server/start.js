import schedule from 'node-schedule';
import { taskAction } from './action/task';

const taskSchedule = () => {
  schedule.scheduleJob('0 0 0 * *', () => taskAction.autocompleteTask());
  schedule.scheduleJob('0 0 6 * *', () => taskAction.autocompleteTask());
  schedule.scheduleJob('0 0 12 * *', () => taskAction.autocompleteTask());
  schedule.scheduleJob('0 0 18 * *', () => taskAction.autocompleteTask());
};

export default async () => {
  try {
    taskSchedule();
  } catch (err) {
    console.log(err);
  }
};
