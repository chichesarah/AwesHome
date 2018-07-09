import mongoose from 'mongoose';
import _ from 'lodash';
import standardField from '../../component/db/dbStandardField';

export default new mongoose.Schema(
  _.assignIn(
    _.cloneDeep(standardField),
    {
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      zip: { type: String, required: true },
      state: { type: String, required: true },
      type: { type: String, required: true },
    
      fullAddress: { type: String, required: true },
    }));
