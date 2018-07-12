import _ from 'lodash';
import moment from 'moment';

import taskWrite from '../model/write/task';
import userWrite from '../model/write/user';

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

class TaskAction {
  _countNextDate(dueDate, repeat) {
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
  }

  _countEndDate(dueDate, repeat) {
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
  }

  async create(data) {
    const taskData = _.cloneDeep(data.body);

    taskData.ownerId = data.ownerObj._id;
    taskData.householdId = data.ownerObj.householdId;

    taskData.taskNameId = data.taskNameObj._id;
    taskData.taskName = data.taskNameObj.name;

    taskData.dueDate = moment(taskData.dueDate);

    taskData.nextDate = this._countNextDate(taskData.dueDate, data.body.repeat);

    const task = await taskWrite.newTask(taskData);

    return _.pick(task, taskFreeData);
  }

  async update(data) {
    const today = moment().startOf('day');
    const taskData = _.assignIn(data.taskObj, data.body);
    delete taskData.taskId;

    taskData.dueDate = moment(taskData.dueDate);
    let nextDate = this._countNextDate(taskData.dueDate, taskData.repeat);

    while (nextDate < today && taskData.repeat !== 'not repeat') {
      nextDate = this._countNextDate(nextDate, taskData.repeat);
    }

    taskData.nextDate = nextDate;

    const task = await taskWrite.updateTask(taskData);

    return _.pick(task, taskFreeData);
  }

  async delete(_id) {
    const taskData = await taskWrite.findById(_id);
    const endDate = this._countEndDate(taskData.nextDate, taskData.repeat);

    const task = await taskWrite.deleteTask(_id, endDate);

    return _.pick(task, taskFreeData);
  }

  async complete(_id) {
    const taskData = await taskWrite.findById(_id);

    if (taskData.repeat === 'not repeat') {
      taskData.endDate = taskData.nextDate;
      taskData.isDeleted = true;
    } else {
      taskData.nextDate = this._countNextDate(taskData.nextDate, taskData.repeat);
    }

    const task = await taskWrite.completeTask(_id, taskData);

    return _.pick(task, taskFreeData);
  }

  async getByHousehold(user) {
    const userData = await userWrite.findById(user._id);

    const tasks = await taskWrite.getTasksByHousehold(userData.householdId);

    return tasks;
  }

  async getByAssignedUser(user) {
    const userData = await userWrite.findById(user._id);

    const tasks = await taskWrite.getByAssignedUser(user._id, userData.householdId);

    return tasks;
  }

  async autocompleteTask() {
    const today = moment().startOf('day');
    const tasks = await taskWrite.getOverdueTasks(today);

    tasks.forEach((task) => {
      let nextDate = this._countNextDate(task.nextDate, task.repeat);

      while (nextDate < today && task.repeat !== 'not repeat') {
        nextDate = this._countNextDate(nextDate, task.repeat);
      }

      taskWrite.updateTask(_.assignIn(task, { nextDate }));
    });
  }
}

export default TaskAction;

export const taskAction = new TaskAction();
