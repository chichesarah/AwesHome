import dbList from './../../db';
import crypto from 'crypto';
import mongoose from 'mongoose';
import * as _ from 'lodash';
import token from '../../component/token';

const userWrite = dbList.write('user');
export default userWrite;

userWrite.hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('base64');
  return {
    salt,
    password: userWrite.saltPassword(salt, password),
  };
};

userWrite.saltPassword = (salt, password) =>
  crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64');

userWrite.update = async ({ query, data, callback }) => {
  data.updatedAt = new Date();
  const user = await userWrite.updateRow({
    query,
    data,
    callback,
  });

  return user;
};

userWrite.newUser = async (data) => {
  const user = await userWrite.insertRow({
    data: _.assignIn(data, userWrite.hashPassword(data.password)),
  });
  return _.assignIn(user, await token.genRefresh(user));
};

userWrite.changePassword = async (id, password) => {
  const data = userWrite.hashPassword(password);
  data.updatedAt = new Date();

  return userWrite.updateRow({
    query: {
      _id: id,
    },
    data,
  });
};

userWrite.findByEmail = async email =>
  userWrite.findRow({
    query: {
      email,
    },
  });

userWrite.getByHouseholdId = (householdId, userId) =>
  userWrite.findRows({
    query: {
      householdId,
      isDeleted: false,
      _id: {
        $ne: userId,
      },
    },
  });

userWrite.checkMembers = (member, householdId) =>
  userWrite.findRows({
    query: {
      _id: {
        $in: member.map(item => mongoose.Types.ObjectId(item)),
      },
      householdId: {
        $eq: householdId,
      },
      isDeleted: false,
    },
  });
