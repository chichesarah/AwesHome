import mongoose from 'mongoose';
import _ from 'lodash';
import standardField from '../../component/db/dbStandardField';

export default new mongoose.Schema(
  _.assignIn(
    _.cloneDeep(standardField),
    {
      email: { type: String, trim: true, default: null },
      householdId: { type: 'ObjectId', default: null },

      avatar: { type: String },
      avatarId: { type: String, default: null },
      lastName: { type: String, required: true },
      firstName: { type: String, required: true },

      isRegisterAnswers: { type: Boolean, default: false },
      roommatesCount: { type: Number, default: 0 },
      neighbourhoodId: { type: 'ObjectId', required: true },
      neighbourhood: { type: String, required: true },

      notification: { type: Boolean, default: true },

      salt: String,
      password: String,

      identities: {
        facebookId: { type: String, default: null },
      },

      roles: [{ type: String, enum: ['admin', 'user'], default: ['user'] }],

      birthday: { type: Date, default: null },
      phone: { type: String, default: null },
    }),
);
