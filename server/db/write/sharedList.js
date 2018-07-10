import mongoose from 'mongoose';
import _ from 'lodash';
import standardField from '../../component/db/dbStandardField';

export default new mongoose.Schema(
  _.assignIn(
    _.cloneDeep(standardField),
    {
      householdId: { type: 'ObjectId', default: null },
      
      name: { type: String, required: true },
      member: [{ type: 'ObjectId', required: true }],
      item: [{
        memberId: { type: 'ObjectId', required: true },
        name: { type: String, required: true },
        status: { type: Boolean, default: false },
      },
    ],
    ownerId: { type: 'ObjectId', required: true },
  }),
);
