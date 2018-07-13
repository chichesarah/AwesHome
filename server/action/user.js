import cloudinary from 'cloudinary';
import q from 'q';
import _ from 'lodash';
import request from 'request';

import userWrite from '../model/write/user';
import householdWrite from '../model/write/household';
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
  'householdId',
  'isRegisterAnswers',
  'notification',
  'birthday',
];

class UserAction {
  async getGoogleAddress(placeId) {
    const deferred = q.defer();

    request(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${config.google.api_key}`, (error, response, body) => {
      if (error) {
        deferred.reject([{ param: 'placeId', message: 'Google place error' }]);
      }

      deferred.resolve(JSON.parse(body));
    });

    const googleAddress = await deferred.promise;

    const streetNumber = _.find(googleAddress.result.address_components, ['types', ['street_number']]);
    const route = _.find(googleAddress.result.address_components, ['types', ['route']]);
    const city = _.find(googleAddress.result.address_components, ['types', ['locality', 'political']]);
    const state = _.find(googleAddress.result.address_components, ['types', ['administrative_area_level_1', 'political']]);
    const zip = _.find(googleAddress.result.address_components, ['types', ['postal_code']]);

    const address = {
      streetNumber,
      route,
      city,
      zip,
      state,
      fullAddress: googleAddress.result.formatted_address,
    };

    return address;
  }

  async registerAnswers(data, user) {
    const userData = _.cloneDeep(data.userObj);

    userData.updatedAt = new Date();
    userData.isRegisterAnswers = true;
    userData.roommatesCount = data.fields.roommatesCount;

    const householdObj = await householdWrite.findRow({
      query: {
        placeId: data.fields.placeId,
        isDeleted: false,
      },
    });

    if (!householdObj) {
      const householdAddress = {
        addressLine: `${data.googleAddress.streetNumber.short_name || ''} ${data.googleAddress.route.short_name || ''}`,
        city: data.googleAddress.city.short_name,
        zip: data.googleAddress.zip.short_name,
        state: data.googleAddress.state.short_name,

        fullAddress: data.googleAddress.fullAddress,
        placeId: data.fields.placeId,
      };

      const household = await householdWrite.insertRow({ data: householdAddress });
      userData.householdId = household._id;
    } else {
      userData.householdId = householdObj._id;
    }

    if (data.files.avatar) {
      const deferred = q.defer();
      cloudinary.uploader.upload(data.files.avatar.path, (result) => {
        if (result.error) {
          deferred.reject([{ param: 'avatar', message: 'Upload error' }]);
          return;
        }
        deferred.resolve(result);
      });
      const uploaderResult = await deferred.promise;
      userData.avatarId = uploaderResult.public_id;
      userData.avatar = uploaderResult.url;
    }

    const userUpdate = await userWrite.updateRow({
      query: { _id: user._id },
      data: userData,
    });

    return _.pick(userUpdate, userFreeData);
  }

  async update(data, user) {
    const userObj = await userWrite.findById(user._id);
    const userData = _.cloneDeep(data.fields);
    userData.updatedAt = new Date();

    const newAvatar = data.files.avatar ? data.files.avatar.path : null;

    if (userData.removeAvatar) {
      userData.removeAvatar = userData.removeAvatar === 'true';
    }

    if (userData.notification) {
      userData.notification = userData.notification === 'true';
    }

    if (userObj.avatarId && (newAvatar || userData.removeAvatar)) {
      const deferred = q.defer();
      cloudinary.uploader.destroy(data.avatarId, (result) => {
        deferred.resolve(result);
      });
      await deferred.promise;
      userData.avatarId = null;
    }

    if (userData.removeAvatar) {
      userData.avatar = null;
    }

    if (newAvatar) {
      const deferred = q.defer();
      cloudinary.uploader.upload(newAvatar, (result) => {
        if (result.error) {
          deferred.reject([{ param: 'avatar', message: 'Upload error' }]);
          return;
        }
        deferred.resolve(result);
      });
      const uploaderResult = await deferred.promise;
      userData.avatarId = uploaderResult.public_id;
      userData.avatar = uploaderResult.url;
    }

    if (userData.birthday) {
      userData.birthday = new Date(userData.birthday);
    }

    const newUser = await userWrite.updateProfile(user._id, userData);

    return _.pick(newUser, userFreeData);
  }

  async getMembers(userId) {
    const currentUser = await userWrite.findById({ _id: userId });

    if (!currentUser) {
      throw ([{ param: 'user', message: 'User is not defined' }]);
    }

    if (!currentUser.householdId) {
      throw ([{ param: 'user', message: 'You are not household member' }]);
    }

    return userWrite.getByHouseholdId(currentUser.householdId);
  }
}


export default UserAction;

export const userAction = new UserAction();
