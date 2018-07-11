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
          deferred.reject([{ param: 'avatar', message: 'Upload error' }]);
          return;
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

    return userWrite.getByHouseholdId(currentUser.householdId, currentUser._id);
  }
}


export default UserAction;

export const userAction = new UserAction();
