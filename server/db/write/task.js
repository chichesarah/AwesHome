import mongoose from 'mongoose';
import _ from 'lodash';
import standardField from '../../component/db/dbStandardField';

const repeatValues = [
  'Does not repeat',
  'Every day',
  'Every week',
  'Every 2 weeks',
  'Every month',
  'Every year',
];

export default new mongoose.Schema(
  _.assignIn(
    _.cloneDeep(standardField),
    {
      ownerId: { type: 'ObjectId', required: true },
      householdId: { type: 'ObjectId', required: true, default: null },

      taskNameId: { type: 'ObjectId', required: true },
      taskName: { type: String, required: true },
      dueDate: { type: Date, required: true, default: Date.now },
      repeat: { type: String, enum: repeatValues, required: true },
      reminder: { type: Boolean, default: false },
      assignee: [{ type: 'ObjectId', required: true }],

      nextDate: { type: Date, required: true, default: null },
      endDate: { type: Date, default: null }, // set endDate = (nextDate - repeat), when user delete task
      rotate: { type: Boolean, required: true, default: false },
    }));
