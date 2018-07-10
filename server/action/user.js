import cloudinary from 'cloudinary';
import q from 'q';
import * as _ from 'lodash';

import userWrite from '../model/write/user';
import config from '../config';

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

const userFreeData = [
  'createdAt',
  'updatedAt',
  'isDeleted',
  'roles',
  '_id',
  'email',
  'firstName',
  'lastName',
  'identities',
  'avatar',
];

class UserAction {

  async update(data) {
    data.updatedAt = new Date();

    if (data.avatarId && (data.newAvatar || data.removeAvatar)) {
      const deferred = q.defer();
      cloudinary.uploader.destroy(data.avatarId, (result) => {
        deferred.resolve(result);
      });
      await deferred.promise;
      data.avatarId = null;
    }

    if (data.removeAvatar) {
      data.avatar = null;
    }

    if (data.newAvatar) {
      const deferred = q.defer();
      cloudinary.uploader.upload(data.newAvatar, (result) => {
        if (result.error) {
          throw ([{ param: 'avatar', message: 'Upload error' }]);
        }
        deferred.resolve(result);
      });
      const uploaderResult = await deferred.promise;
      data.avatarId = uploaderResult.public_id;
      data.avatar = uploaderResult.url;
    }

    if (data.birthday) {
      data.birthday = new Date(data.birthday);
    }

    const user = await userWrite.updateRow({
      query: { _id: data._id },
      data,
    });

    return _.pick(user, userFreeData);
  }

  async getMembers(userId) {
    const currentUser = await userWrite.findById({ id: userId });

    if (!currentUser) {
      throw ([{ param: 'user', message: 'User is not defined' }]);
    }

    if (!currentUser.householdId) {
      throw ([{ param: 'user', message: 'You are not household member' }]);
    }

    return currentUser.getByHouseholdId(currentUser.householdId, currentUser.id);
  }
}


export default UserAction;

export const userAction = new UserAction();
