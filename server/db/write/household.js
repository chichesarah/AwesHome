import mongoose from 'mongoose';
import _ from 'lodash';
import standardField from '../../component/db/dbStandardField';

export default new mongoose.Schema(
  _.assignIn(
    _.cloneDeep(standardField),
    {
      addressLine: { type: String, default: '' },
      city: { type: String, default: '' },
      zip: { type: String, default: '' },
      state: { type: String, default: '' },

      fullAddress: { type: String, default: '' },
      placeId: { type: String, default: null },
    }));
