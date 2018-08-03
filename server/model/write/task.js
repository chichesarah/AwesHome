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

taskWrite.getTasksByHousehold = _id =>
  taskWrite.aggregateRows({
    query: [
      {
        $match: {
          householdId: _id,
          isDeleted: false,
          $or: notEndedTasks(),
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
      // {
      //   $project: {
      //     assignee: '$assignee',
      //   },
      // },
      {
        $group: {
          _id: {
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
          _id: '$_id',
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
      {
        $unwind: '$assignee',
      },
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

taskWrite.getTasksByDuration = ({ householdId, startDate, endDate }) =>
  taskWrite.findRows({
    query: {
      householdId,
      dueDate: { $lte: endDate },
      $or: [
        { endDate: { $exists: false } },
        { endDate: { $eq: null } },
        { endDate: { $gte: startDate } },
      ],
    },
  });
