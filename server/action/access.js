import keygen from 'keygen';
import q from 'q';
import _ from 'lodash';
import request from 'request';

import userWrite from '../model/write/user';
import config from '../config';
import token from '../component/token';
import mailer from '../component/mailer';

const userFreeData = [
  'accessToken',
  'refreshToken',
  'createdAt',
  'updatedAt',
  'isDeleted',
  'roles',
  '_id',
  'email',
  'identities',
  'avatar',
  'firstName',
  'lastName',
  'isRegisterAnswers',
  'householdId',
  'notification',
  'birthday',
];

class AccessAction {
  async forgot(user) {
    const pass = keygen.url(config.passwordLength);

    const userData = await userWrite.changePassword(user._id, pass);
    const deferred = q.defer();

    mailer.messages().send({
      from: config.mailgun.mailFrom,
      to: userData.email,
      subject: 'Pasword reset',
      html: `<h4>This letter was sent to your e-mail to verify the identity when changing the password.</h4>
        <p>New password: ${pass}</p>`,
    }, (err, body) => {
      if (err) {
        // console.log(err);
        deferred.reject(err);
        return;
      }
      deferred.resolve(body);
    });

    await deferred.promise;


    return {
      result: 'success',
    };
  }

  async register(data) {
    const user = await userWrite.newUser(_.assignIn(data, { roles: ['user'] }));

    return _.pick(user, userFreeData);
  }

  async socReg(profile) {
    let user = await userWrite.findByEmail(profile.email);
    if (user) {
      profile.identities.facebookId = profile.identities.facebookId ? profile.identities.facebookId : user.identities.facebookId;
      user = await userWrite.update({
        query: {
          _id: user._id,
        },
        data: profile,
      });

    } else {
      user = await userWrite.insertRow({
        data: profile,
      });
    }

    user = _.assignIn(user, await token.genRefresh(user));
    return _.pick(user, userFreeData);
  }

  async socAuth(profile) {
    let user = await userWrite.findByEmail(profile.email);
    if (user) {
      profile.identities.facebookId = profile.identities.facebookId ? profile.identities.facebookId : user.identities.facebookId;
      user = await userWrite.update({
        query: {
          _id: user._id,
        },
        data: profile,
      });

    } else {
      throw ([{ param: 'email', message: 'User not found' }]);
    }

    user = _.assignIn(user, await token.genRefresh(user));
    return _.pick(user, userFreeData);
  }

  async login(user) {
    const userData = _.assignIn(user, await token.genRefresh(user));
    return _.pick(userData, userFreeData);
  }

  async loginConfirm(user) {
    const userData = await userWrite.findById({ id: user._id });
    return _.pick(userData, userFreeData);
  }

  async refreshToken(userToken) {
    const user = await userWrite.findById({ id: userToken.userId });
    return _.pick(_.assignIn(user, await token.genNewAccess(user)), userFreeData);
  }

  async changePassword(password, user) {
    await userWrite.changePassword(user._id, password);
    return {
      result: 'success',
    };
  }

  async facebook(data) {
    const deferred = q.defer();

    request(`${config.links.facebook}${data.token}`, (error, response, body) => {
      if (error) {
        deferred.reject([{ param: 'token', message: 'Invalid token' }]);
      }

      deferred.resolve(JSON.parse(body));
    });

    const userFacebookData = await deferred.promise;

    let facebookUser = await userWrite.findByFacebookId(userFacebookData.id);

    if (!facebookUser) {
      const userData = {
        firstName: userFacebookData.first_name || null,
        lastName: userFacebookData.last_name || null,
        identities: {
          facebookId: userFacebookData.id,
        },
        email: userFacebookData.email || null,
        birthday: userFacebookData.birthday || null,
      };

      if (userFacebookData.picture && userFacebookData.picture.data) {
        userData.avatar = userFacebookData.picture.data.url || null;
      }

      facebookUser = await userWrite.newFacebookUser(_.assignIn(userData, { roles: ['user'] }));
    }

    return _.pick(_.assignIn(facebookUser, await token.genRefresh(facebookUser)), userFreeData);
  }
}

export default AccessAction;

export const accessAction = new AccessAction();
