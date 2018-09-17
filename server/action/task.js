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

export const convertDateToResponse = date =>
  `${moment(date).format('YYYY-MM-DDTHH:mm:ss.SSS')}Z`;

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


export const countExectDate = (dueDate, repeat, count = 1) => {
  switch (repeat) {
    case 'Every day':
      return moment(dueDate).add(1 * count, 'd');
    case 'Every week':
      return moment(dueDate).add(1 * count, 'w');
    case 'Every 2 weeks':
      return moment(dueDate).add(2 * count, 'w');
    case 'Every month':
      return moment(dueDate).add(1 * count, 'M');
    case 'Every year':
      return moment(dueDate).add(1 * count, 'y');
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

export const calcUsers = (task, startDate, nextDate) => {
  let diff;
  let currentIndex;

  if (task.repeat === 'Every 2 weeks') {
    diff = nextDate.diff(startDate, 'weeks');

    const twiceDiff = diff / 2;
    currentIndex = (twiceDiff + task.startIndex) % task.assignee.length;
  } else if (task.repeat === 'Every month') {
    diff = nextDate.diff(startDate, 'month', true);
    diff = Math.round(diff);

    currentIndex = (diff + task.startIndex) % task.assignee.length;
  } else {
    diff = nextDate.diff(startDate, timeDiff(task.repeat));

    currentIndex = (diff + task.startIndex) % task.assignee.length;
  }
  const currentMember = task.assignee.filter(
    (member, index) => index === currentIndex,
  );
  return currentMember;
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
    eventBus.emit(
      'assigneeToTask',
      _.assignIn(task, { ownerId: data.ownerObj._id }),
    );

    return _.pick(
      _.assignIn(task, {
        dueDate: convertDateToResponse(task.dueDate),
        nextDate: convertDateToResponse(task.nextDate),
      }),
      taskFreeData,
    );
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

      while (nextDate < today && taskData.repeat !== 'Does not repeat') {
        nextDate = countNextDate(nextDate, taskData.repeat);
      }

      taskData.nextDate = nextDate;
    }

    const task = await taskWrite.updateTask(taskData);

    return _.pick(
      _.assignIn(task, {
        dueDate: convertDateToResponse(task.dueDate),
        nextDate: convertDateToResponse(task.nextDate),
      }),
      taskFreeData,
    );
  }

  async delete(data) {
    const taskData = await taskWrite.findById(data._id);
    const endDate = countEndDate(taskData.nextDate, taskData.repeat);

    const task = await taskWrite.deleteTask(data._id, endDate);

    eventBus.emit(
      'deleteTask',
      _.assignIn(task, { currentUserId: data.userId }),
    );

    return _.pick(task, taskFreeData);
  }

  async complete(data) {
    const taskData = await taskWrite.findById(data._id);

    if (taskData.repeat === 'Does not repeat') {
      taskData.endDate = taskData.nextDate;
      taskData.isDeleted = true;
    } else {
      taskData.nextDate = countNextDate(taskData.nextDate, taskData.repeat);
    }

    eventBus.emit(
      'completeTask',
      _.assignIn(taskData, { currentUserId: data.userId }),
    );

    if (taskData.rotate) {
      const startDate = convertDataUtc(taskData.dueDate);
      const nextDate = countNextDate(taskData.nextDate, taskData.repeat);
      const currentMember = calcUsers(taskData, startDate, nextDate);

      eventBus.emit('taskToNextMember', { taskData, currentMember });
    }

    const task = await taskWrite.completeTask(data._id, taskData);

    return _.pick(
      _.assignIn(task, {
        dueDate: convertDateToResponse(task.dueDate),
        nextDate: convertDateToResponse(task.nextDate),
      }),
      taskFreeData,
    );
  }

  async getByHousehold(user) {
    const userData = await userWrite.findById({ id: user._id });

    const tasks = await taskWrite.getTasksByHousehold(userData.householdId);

    if (tasks && tasks.length) {
      return tasks
        .map((task) => {
          if (task.rotate) {
            const startDate = convertDataUtc(task.dueDate);
            const nextDate = countNextDate(task.nextDate, task.repeat);

            const currentMember = calcUsers(task, startDate, nextDate);

            task.currentMember = currentMember;
            task.nextDate = convertDateToResponse(task.nextDate);
            task.dueDate = convertDateToResponse(task.dueDate);

            return task;
          }

          return task;
        })
        .filter(task => Object.keys(task).length);
    }
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
          const startDate = convertDataUtc(task.dueDate);
          const nextDate = countNextDate(task.nextDate, task.repeat);

          const currentMember = calcUsers(task, startDate, nextDate);

          task.currentMember = currentMember;
          task.dueDate = convertDateToResponse(task.dueDate);
          task.nextDate = convertDateToResponse(task.nextDate);

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

      currentTask.nextDate = convertDateToResponse(currentTask.nextDate);
      currentTask.dueDate = convertDateToResponse(currentTask.dueDate);

      if (task.repeat === 'Does not repeat') {
        currentTask.endDate = task.nextDate;
        currentTask.isDeleted = true;
      } else {
        while (nextDate < today) {
          nextDate = countNextDate(nextDate, task.repeat);

          if (task.rotate) {
            const startDate = convertDataUtc(task.dueDate);

            const currentMember = calcUsers(
              task,
              startDate,
              moment(task.nextDate),
            );

            eventBus.emit('taskToNextMember', { task, currentMember });
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
      const startDate = convertDataUtc(task.dueDate);
      const nextDate = moment(task.nextDate);
      const lastDay = nextDate.diff(today, 'days');
      const currentMember = calcUsers(task, startDate, nextDate);

      if (task.rotate) {
        if (task.reminder && lastDay === 1) {
          eventBus.emit('soonEndTask', _.assignIn(task, { currentMember }));
        }
      }

      if (task.reminder && lastDay === 1) {
        eventBus.emit('soonEndTask', task);
      }
    });
  }
}

export default TaskAction;

export const taskAction = new TaskAction();
