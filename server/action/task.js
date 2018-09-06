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
  'rotate',
  'startIndex',
];

export const convertDataUtc = data =>
  moment(`${moment(data).format('YYYY-MM-DD')} utc`, 'YYYY-MM-DD Z');

export const countNextDate = (dueDate, repeat) => {
  switch (repeat) {
    case 'Every day':
      return moment(dueDate).add(1, 'd');
    case 'Every week':
      return moment(dueDate).add(1, 'w');
    case 'Every 2 weeks':
      return moment(dueDate).add(2, 'w');
    case 'Every month':
      return moment(dueDate).add(1, 'M');
    case 'Every year':
      return moment(dueDate).add(1, 'y');
    case 'Does not repeat':
      return moment(dueDate);
    default:
      return null;
  }
};

export const countEndDate = (dueDate, repeat) => {
  switch (repeat) {
    case 'Every day':
      return moment(dueDate).subtract(1, 'd');
    case 'Every week':
      return moment(dueDate).subtract(1, 'w');
    case 'Every 2 weeks':
      return moment(dueDate).subtract(2, 'w');
    case 'Every month':
      return moment(dueDate).subtract(1, 'M');
    case 'Every year':
      return moment(dueDate).subtract(1, 'y');
    case 'Does not repeat':
      return moment(dueDate);
    default:
      return null;
  }
};

export const timeDiff = (type) => {
  switch (type) {
    case 'Every day':
      return 'days';
    case 'Every week':
      return 'weeks';
    case 'Every month':
      return 'months';
    case 'Every year':
      return 'years';
    default:
      return 'days';
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
    taskData.nextDate = countNextDate(
      convertDataUtc(taskData.createdAt),
      taskData.repeat,
    );

    if (taskData.nextDate.isAfter(taskData.dueDate)) {
      taskData.nextDate = convertDataUtc(taskData.dueDate);
    }

    const task = await taskWrite.newTask(taskData);

    eventBus.emit('addTask', task);

    return _.pick(task, taskFreeData);
  }

  async update(data) {
    const taskData = _.assignIn(data.taskObj, data.body);
    delete taskData.taskId;

    if (convertDataUtc(taskData.nextDate).isAfter(taskData.dueDate)) {
      taskData.nextDate = convertDataUtc(taskData.dueDate);
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

    if (taskData.repeat === 'Does not repeat') {
      taskData.endDate = taskData.nextDate;
      taskData.isDeleted = true;
    } else {
      taskData.nextDate = countNextDate(taskData.nextDate, taskData.repeat);

      eventBus.emit('addTask', taskData);

      if (taskData.nextDate.isAfter(taskData.dueDate)) {
        taskData.endDate = taskData.dueDate;
        taskData.isDeleted = true;
      }
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

    const tasks = await taskWrite.getByAssignedUser(
      user._id,
      userData.householdId,
    );

    return tasks
      .map((task) => {
        if (task.rotate) {
          const startDate = convertDataUtc(task.createdAt);
          const nextDate = moment(task.nextDate);

          let diff;
          let currentIndex;

          if (task.repeat === 'Every 2 weeks') {
            diff = nextDate.diff(startDate, 'week');

            const twiceDiff = diff * 2;
            currentIndex = (twiceDiff + task.startIndex) % task.assignee.length;
          } else {
            diff = nextDate.diff(startDate, timeDiff(task.repeat));

            currentIndex = (diff + task.startIndex) % task.assignee.length;
          }

          const currentMember = task.assignee.filter(
            (member, index) => index === currentIndex,
          );
          task.currentMember = currentMember;

          if (currentMember[0]._id.toString() !== userData._id.toString()) {
            return {};
          }
          return task;
        }

        return task;
      })
      .filter(task => Object.keys(task).length);
  }

  async autocompleteTask() {
    const today = moment().startOf('day');
    const tasks = await taskWrite.getOverdueTasks(today);

    tasks.forEach((task) => {
      const currentTask = _.cloneDeep(task);
      let nextDate = countNextDate(task.nextDate, task.repeat);

      if (task.repeat === 'Does not repeat') {
        currentTask.endDate = task.nextDate;
        currentTask.isDeleted = true;
      } else {
        while (nextDate < today) {
          nextDate = countNextDate(nextDate, task.repeat);

          if (nextDate.isAfter(task.dueDate)) {
            currentTask.endDate = task.dueDate;
            currentTask.isDeleted = true;
          }
        }
      }

      taskWrite.updateTask(_.assignIn(currentTask, { nextDate }));
    });
  }

  async myTaskIsMine() {
    const today = moment().startOf('day');
    const tasks = await taskWrite.getLowerTasks(today);

    tasks.forEach((task) => {
      const dueDate = convertDataUtc(task.dueDate);

      const diff = dueDate.diff(today, 'days');

      if (diff === 1) {
        eventBus.emit('soonEndTask', task);
      }
    });
  }
}

export default TaskAction;

export const taskAction = new TaskAction();
