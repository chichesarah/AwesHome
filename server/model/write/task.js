import mongoose from 'mongoose';
import moment from 'moment';
import dbList from './../../db';

const taskWrite = dbList.write('task');
export default taskWrite;

const notEndedTasks = () => [
  { endDate: { $exists: false } },
  { endDate: { $eq: null } },
  { endDate: { $gt: moment().startOf('day').add(1, 'd') } },
];

const getTaskList = () => [
  {
    $lookup: {
      from: 'users',
      localField: 'ownerId',
      foreignField: '_id',
      as: 'owner',
    },
  },
  {
    $unwind: '$owner',
  },
  {
    $unwind: '$assignee',
  },
  {
    $lookup: {
      from: 'users',
      localField: 'assignee',
      foreignField: '_id',
      as: 'assignee',
    },
  },
  {
    $unwind: '$assignee',
  },
  {
    $project: {
      isDeleted: 1,
      householdId: 1,
      reminder: 1,
      nextDate: 1,
      endDate: 1,
      taskNameId: 1,
      dueDate: 1,
      repeat: 1,
      taskName: 1,
      createdAt: 1,
      updatedAt: 1,
      'assignee._id': 1,
      'assignee.firstName': 1,
      'assignee.lastName': 1,
      'assignee.avatar': 1,
      'assignee.createdAt': 1,
      'assignee.updatedAt': 1,
      'assignee.isDeleted': 1,
      'owner._id': 1,
      'owner.firstName': 1,
      'owner.lastName': 1,
      'owner.avatar': 1,
      'owner.createdAt': 1,
      'owner.updatedAt': 1,
      'owner.isDeleted': 1,
    },
  },
  {
    $group: {
      _id: {
        _id: '$_id',
        isDeleted: '$isDeleted',
        householdId: '$householdId',
        reminder: '$reminder',
        nextDate: '$nextDate',
        endDate: '$endDate',
        taskNameId: '$taskNameId',
        dueDate: '$dueDate',
        repeat: '$repeat',
        taskName: '$taskName',
        createdAt: '$createdAt',
        updatedAt: '$updatedAt',
        owner: '$owner',
      },
      assignee: {
        $push: '$assignee',
      },
    },
  },
  {
    $project: {
      _id: '$_id._id',
      isDeleted: '$_id.isDeleted',
      owner: '$_id.owner',
      householdId: '$_id.householdId',
      reminder: '$_id.reminder',
      nextDate: '$_id.nextDate',
      endDate: '$_id.endDate',
      assignee: '$assignee',
      taskNameId: '$_id.taskNameId',
      dueDate: '$_id.dueDate',
      repeat: '$_id.repeat',
      taskName: '$_id.taskName',
      createdAt: '$_id.createdAt',
      updatedAt: '$_id.updatedAt',
    },
  },
];

taskWrite.newTask = data => taskWrite.insertRow({ data });

taskWrite.updateTask = data =>
  taskWrite.updateRow({
    query: { _id: data._id },
    data,
  });

taskWrite.findById = _id =>
  taskWrite.findRow({
    query: {
      _id,
      isDeleted: false,
    },
  });

taskWrite.findByIdInHousehold = (_id, householdId) =>
  taskWrite.findRow({
    query: {
      _id,
      householdId,
      isDeleted: false,
    },
  });

taskWrite.deleteTask = (_id, endDate) =>
  taskWrite.updateRow({
    query: { _id },
    data: {
      endDate,
      isDeleted: true,
    },
  });

taskWrite.completeTask = (_id, { nextDate, endDate, isDeleted }) =>
  taskWrite.updateRow({
    query: { _id },
    data: {
      nextDate,
      endDate,
      isDeleted,
    },
  });

taskWrite.getTasksByHousehold = householdId =>
  taskWrite.aggregateRows({
    query: [
      {
        $match: {
          householdId,
          isDeleted: false,
          $or: notEndedTasks(),
        },
      },
      ...getTaskList(),
    ],
  });

taskWrite.getByAssignedUser = async (_id, householdId) =>
  taskWrite.aggregateRows({
    query: [
      {
        $match: {
          householdId,
          isDeleted: false,
          assignee: {
            $eq: mongoose.Types.ObjectId(_id),
          },
          $or: notEndedTasks(),
        },
      },
      ...getTaskList(),
    ],
  });

taskWrite.getOverdueTasks = today =>
  taskWrite.findRows({
    query: {
      isDeleted: false,
      nextDate: {
        $lt: today,
      },
      $or: notEndedTasks(),
    },
  });

taskWrite.getTasksByDuration = ({ householdId, startDate, endDate }) => {
  const start = startDate.toDate();
  const end = endDate.toDate();

  return taskWrite.aggregateRows({
    query: [
      {
        $match: {
          householdId,
          dueDate: { $lte: end },
          $or: [
            { endDate: { $exists: false } },
            { endDate: { $eq: null } },
            { endDate: { $gte: start } },
          ],
        },
      },
      {
        $unwind: '$assignee',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'assignee',
          foreignField: '_id',
          as: 'assignee',
        },
      },
      {
        $unwind: '$assignee',
      },
      {
        $project: {
          isDeleted: 1,
          householdId: 1,
          reminder: 1,
          nextDate: 1,
          endDate: 1,
          taskNameId: 1,
          dueDate: 1,
          repeat: 1,
          ownerId: 1,
          taskName: 1,
          createdAt: 1,
          updatedAt: 1,
          'assignee._id': 1,
          'assignee.firstName': 1,
          'assignee.lastName': 1,
          'assignee.avatar': 1,
          'assignee.avatarId': 1,
          'assignee.createdAt': 1,
          'assignee.updatedAt': 1,
          'assignee.isDeleted': 1,
        },
      },
      {
        $group: {
          _id: {
            _id: '$_id',
            isDeleted: '$isDeleted',
            householdId: '$householdId',
            reminder: '$reminder',
            nextDate: '$nextDate',
            endDate: '$endDate',
            taskNameId: '$taskNameId',
            dueDate: '$dueDate',
            repeat: '$repeat',
            ownerId: '$ownerId',
            taskName: '$taskName',
            createdAt: '$createdAt',
            updatedAt: '$updatedAt',
          },
          assignee: {
            $push: '$assignee',
          },
        },
      },
      {
        $project: {
          _id: '$_id._id',
          isDeleted: '$_id.isDeleted',
          householdId: '$_id.householdId',
          reminder: '$_id.reminder',
          nextDate: '$_id.nextDate',
          endDate: '$_id.endDate',
          assignee: '$assignee',
          taskNameId: '$_id.taskNameId',
          dueDate: '$_id.dueDate',
          repeat: '$_id.repeat',
          ownerId: '$_id.ownerId',
          taskName: '$_id.taskName',
          createdAt: '$_id.createdAt',
          updatedAt: '$_id.updatedAt',
        },
      },
    ],
  });
};
