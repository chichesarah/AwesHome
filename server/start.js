import schedule from 'node-schedule';
import { taskAction } from './action/task';
import { neighbourhoodAction } from './action/neighbourhood';

const taskSchedule = () => {
  schedule.scheduleJob('0 0 0 * *', () => taskAction.autocompleteTask());
  schedule.scheduleJob('0 0 6 * *', () => taskAction.autocompleteTask());
  schedule.scheduleJob('0 0 12 * *', () => taskAction.autocompleteTask());
  schedule.scheduleJob('0 0 18 * *', () => taskAction.autocompleteTask());
  schedule.scheduleJob('0 1 0 * * *', () => taskAction.myTaskIsMine());
};

export default async () => {
  try {
    neighbourhoodAction.setInDB();
    taskSchedule();
  } catch (err) {
    console.log(err);
  }
};
