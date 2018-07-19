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
  taskWrite.findRows({
    query: {
      householdId: _id,
      isDeleted: false,
      $or: notEndedTasks(),
    },
  });

taskWrite.getByAssignedUser = (_id, householdId) =>
  taskWrite.findRows({
    query: {
      householdId,
      isDeleted: false,
      assignee: {
        $eq: mongoose.Types.ObjectId(_id),
      },
      $or: notEndedTasks(),
    },
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
