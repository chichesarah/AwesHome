import mongoose from 'mongoose';
import _ from 'lodash';
import standardField from '../../component/db/dbStandardField';

export default new mongoose.Schema(
  _.assignIn(
    _.cloneDeep(standardField),
    {
      ownerId: { type: 'ObjectId', required: true },
      householdId: { type: 'ObjectId', default: null },
    
      taskNameId: { type: 'ObjectId', required: true },
      taskName: { type: String, required: true },
      dueDate: { type: Date, required: true, default: Date.now },
      repeat: { type: Number, required: true, default: 0 },
      reminder: { type: Boolean, defaul: false },
      assignee: [{ type: 'ObjectID', required: true }],
      reward: { type: Number, required: true, defaul: 0, min: 0, max: 100 },
    
      nextDate: { type: Date },
      endDate: { type: Date, defaul: null }, // set: nextDate - repeat, when user delete task
    }));

    taskNameId: { type: 'ObjectId', required: true },
    taskName: { type: String, required: true },
    dueDate: { type: Date, required: true, default: Date.now },
    repeat: { type: Number, required: true, default: 0 },
    reminder: { type: Boolean, defaul: false },
    assignee: [{ type: 'ObjectID', required: true }],
    reward: { type: Number, required: true, defaul: 0, min: 0, max: 100 },

    nextDate: { type: Date },
    endDate: { type: Date, defaul: null }, // set: nextDate - repeat, when user delete task

    // complete ?????????
  }),
);
