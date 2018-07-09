import mongoose from 'mongoose';
import _ from 'lodash';
import standardField from '../../component/db/dbStandardField';

export default new mongoose.Schema(
  _.assignIn(_.cloneDeep(standardField), {
    ownerId: { type: 'ObjectId', required: true },

    title: { type: String, required: true },
    member: [{ type: 'ObjectID', required: true }],
    startDate: { type: Date, required: true, defaul: Date.now },
    endDate: { type: Date, required: true, defaul: Date.now },
    fullAddress: { type: String, required: true },
    notify: { type: Boolean, defaul: false },
  }),
);
