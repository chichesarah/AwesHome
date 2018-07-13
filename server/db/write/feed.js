import mongoose from 'mongoose';
import _ from 'lodash';
import standardField from '../../component/db/dbStandardField';

export default new mongoose.Schema(
  _.assignIn(
    _.cloneDeep(standardField),
    {
      userId: { type: 'ObjectId', required: true },
      householdId: { type: 'ObjectId', required: true },
      type: {
        type: String,
        required: true,
        enum: [
          'join household',
          'remove household',
          'add task',
          'delete task',
          'complete task',
          'add event',
          'delete event',
          'create list',
          'delete list',
          'add listItem',
          'check listItem',
        ],
      },
      operation: [{
        id: { type: 'ObjectId', default: null },
        name: { type: String },
        type: { type: String },
      }],
    }));
