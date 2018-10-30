import moment from 'moment';

import config from '../config';
import udidWrite from '../model/write/udid';
import userWrite from '../model/write/user';

const FCM = require('fcm-push');
const apn = require('apn');

const fcm = new FCM(config.notification.serverKey);

const options = {
  token: {
    key: config.notification.key,
    keyId: config.notification.keyId,
    teamId: config.notification.teamId,
  },
  production: config.notification.production,
};

const apnProvider = new apn.Provider(options);

const handlePush = (array, text) => {
  if (array && array.length) {
    array.map((item) => {
      if (item.type === 'ios') {
        const note = new apn.Notification({
          expiry: Math.floor(Date.now() / 1000) + 3600, // Expires 1 hour from now.
          // badge: 3,
          alert: text,
          topic: config.notification.topic,
        });

        apnProvider
          .send(note, item.token)
          .then((result) => {
            console.log('result ', JSON.stringify(result, undefined, 2));
          })
          .catch((err) => {
            console.log('error ', err);
          });
      }

      const message = {
        to: item.token,
        notification: { title: text },
      };

      fcm
        .send(message)
        .then((response) => {
          console.log('Successfully sent with response: ', response);
        })
        .catch((err) => {
          console.log('Something has gone wrong!');
          console.error(err);
        });
    });
  }
};

class notificationAction {
  // async addPushTaskEvent(data) {
  //   const udids = await udidWrite.findTokenById(data.assignee);
  //   const user = await userWrite.findById(data.ownerId);

  //   const message = `- ${user.firstName} ${user.lastName} added ${
  //     data.taskName
  //   } to the task organizer.`;

  //   handlePush(udids, message);
  // }

  async pushToNextMember(data) {
    const udids = await udidWrite.findTokenById(data.assignee);

    const message = `Hey! You’ve been assigned to the task ${
      data.taskData.taskName
    } 🙂. Don’t forget to complete it before ${moment(data.dueDate).format(
      'YYYY-MM-DD',
    )}.`;

    handlePush(udids, message);
  }

  async pushNotificationEndTask(data) {
    const message = `Hey! Just wanted to remind you that your task ${
      data.taskName
    } is due by ${moment(data.dueDate).format('YYYY-MM-DD')}`;

    if (data.rotate) {
      const udids = await udidWrite.findTokenById(data.currentMember);
      handlePush(udids, message);
    }

    const udids = await udidWrite.findTokenById(data.assignee);
    handlePush(udids, message);
  }

  async assigneePushTaskEvent(data) {
    const udids = await udidWrite.findTokenById(data.assignee);

    const udidsWithoutMe = udids.filter(
      item => item.userId.toString() !== data.ownerId.toString(),
    );

    const message = `Hey! You’ve been assigned to the task ${
      data.taskName
    } 🙂. Don’t forget to complete it before ${moment(data.dueDate).format(
      'YYYY-MM-DD',
    )}.`;

    handlePush(udidsWithoutMe, message);
  }

  async createPushListEvent(data) {
    const udids = await udidWrite.findTokenById(data.member);
    const user = await userWrite.findById(data.ownerId);

    const udidsWithoutMe = udids.filter(
      item => item.userId.toString() !== data.ownerId.toString(),
    );

    const message = `Hey! ${user.firstName} ${user.lastName} created the list ${
      data.name
    } and shared it with you.`;

    handlePush(udidsWithoutMe, message);
  }

  async createPushEventObj(data) {
    const udids = await udidWrite.findTokenById(data.member);
    const user = await userWrite.findById(data.ownerId);

    const udidsWithoutMe = udids.filter(
      item => item.userId.toString() !== data.ownerId.toString(),
    );

    const message = `Hey! You’ve been invited to the event ${data.title} by ${
      user.firstName
    } ${user.lastName}. It will start on ${moment(data.startDate).format(
      'YYYY-MM-DD',
    )}.`;

    if (data.notify) {
      handlePush(udidsWithoutMe, message);
    }
  }

  async addNewGuestPushEventObj(data) {
    const udids = await udidWrite.findTokenById(data.newMember);
    const user = await userWrite.findById(data.ownerId);

    const message = `Hey! You’ve been invited to the event ${data.title} by ${
      user.firstName
    } ${user.lastName}. It will start on ${moment(data.startDate).format(
      'YYYY-MM-DD',
    )}.`;

    if (data.notify) {
      handlePush(udids, message);
    }
  }
}

export default new notificationAction();
