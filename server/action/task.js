import _ from 'lodash';
import moment from 'moment';

import taskWrite from '../model/write/task';
import userWrite from '../model/write/user';
import eventBus from '../component/eventBus';

const taskFreeData = [
  'createdAt',
  'updatedAt',
  'isDeleted',
  '_id',
  'ownerId',
  'householdId',
  'taskNameId',
  'dueDate',
  'repeat',
  'reminder',
  'assignee',
  'nextDate',
  'endDate',
];

export const convertDataUtc = data => moment(`${moment(data).format('YYYY-MM-DD')} utc`, 'YYYY-MM-DD Z');

export const countNextDate = (dueDate, repeat) => {
  switch (repeat) {
    case 'day':
      return moment(dueDate).add(1, 'd');
    case 'week':
      return moment(dueDate).add(1, 'w');
    case '2 weeks':
      return moment(dueDate).add(2, 'w');
    case 'month':
      return moment(dueDate).add(1, 'M');
    case 'year':
      return moment(dueDate).add(1, 'y');
    case 'not repeat':
      return moment(dueDate);
    default:
      return null;
  }
};

export const countEndDate = (dueDate, repeat) => {
  switch (repeat) {
    case 'day':
      return moment(dueDate).subtract(1, 'd');
    case 'week':
      return moment(dueDate).subtract(1, 'w');
    case '2 weeks':
      return moment(dueDate).subtract(2, 'w');
    case 'month':
      return moment(dueDate).subtract(1, 'M');
    case 'year':
      return moment(dueDate).subtract(1, 'y');
    case 'not repeat':
      return moment(dueDate);
    default:
      return null;
  }
};

class TaskAction {
  async create(data) {
    const taskData = _.cloneDeep(data.body);

    taskData.ownerId = data.ownerObj._id;
    taskData.householdId = data.ownerObj.householdId;

    taskData.taskNameId = data.taskNameObj._id;
    taskData.taskName = data.taskNameObj.name;

    taskData.dueDate = convertDataUtc(taskData.dueDate);
    taskData.nextDate = taskData.dueDate;

    const task = await taskWrite.newTask(taskData);

    eventBus.emit('addTask', task);

    return _.pick(task, taskFreeData);
  }

  async update(data) {
    const today = moment().startOf('day');
    const taskData = _.assignIn(data.taskObj, data.body);
    delete taskData.taskId;

    taskData.dueDate = convertDataUtc(taskData.dueDate);

    if (taskData.dueDate >= moment().startOf('day')) {
      taskData.nextDate = taskData.dueDate;
    } else {
      let nextDate = countNextDate(taskData.dueDate, taskData.repeat);

      while (nextDate < today && taskData.repeat !== 'not repeat') {
        nextDate = countNextDate(nextDate, taskData.repeat);
      }

      taskData.nextDate = nextDate;
    }

    const task = await taskWrite.updateTask(taskData);

    return _.pick(task, taskFreeData);
  }

  async delete(_id) {
    const taskData = await taskWrite.findById(_id);
    const endDate = countEndDate(taskData.nextDate, taskData.repeat);

    const task = await taskWrite.deleteTask(_id, endDate);

    eventBus.emit('deleteTask', task);

    return _.pick(task, taskFreeData);
  }

  async complete(_id) {
    const taskData = await taskWrite.findById(_id);

    if (taskData.repeat === 'not repeat') {
      taskData.endDate = taskData.nextDate;
      taskData.isDeleted = true;
    } else {
      taskData.nextDate = countNextDate(taskData.nextDate, taskData.repeat);
    }

    const task = await taskWrite.completeTask(_id, taskData);

    eventBus.emit('completeTask', task);

    return _.pick(task, taskFreeData);
  }

  async getByHousehold(user) {
    const userData = await userWrite.findById({ id: user._id });

    const tasks = await taskWrite.getTasksByHousehold(userData.householdId);

    return tasks;
  }

  async getByAssignedUser(user) {
    const userData = await userWrite.findById({ id: user._id });

    const tasks = await taskWrite.getByAssignedUser(user._id, userData.householdId);

    return tasks;
  }

  async autocompleteTask() {
    const today = moment().startOf('day');
    const tasks = await taskWrite.getOverdueTasks(today);

    tasks.forEach((task) => {
      const currentTask = _.cloneDeep(task);
      let nextDate = countNextDate(task.nextDate, task.repeat);

      if (task.repeat === 'not repeat') {
        currentTask.endDate = task.nextDate;
        currentTask.isDeleted = true;
      } else {
        while (nextDate < today) {
          nextDate = countNextDate(nextDate, task.repeat);
        }
      }

      taskWrite.updateTask(_.assignIn(currentTask, { nextDate }));
    });
  }
}

export default TaskAction;

export const taskAction = new TaskAction();
