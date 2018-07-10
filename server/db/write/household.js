import mongoose from 'mongoose';
import _ from 'lodash';
import standardField from '../../component/db/dbStandardField';

export default new mongoose.Schema(
  _.assignIn(
    _.cloneDeep(standardField),
    {
      addressLine: { type: String, required: true },
      city: { type: String, required: true },
      zip: { type: String, required: true },
      state: { type: String, required: true },
    
      fullAddress: { type: String, required: true },
      placeId: { type: String, default: null, required: true },
    }));
