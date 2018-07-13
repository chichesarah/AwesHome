import _ from 'lodash';
import config from '../config';
import udidWrite from '../model/write/udid';
const FCM = require('fcm-node');

const fcm = new FCM(config.notification.serverKey);

class notificationAction {
  async addPushTaskEvent(data) {
    const udid = (await udidWrite.findTokenById(data.assignee)).map(item => item.token);

    const message = {
      registration_ids: udid,
      collapse_key: 'your_collapse_key',
      notification: {
        title: `Create a task ${data.taskName}`,
        body: 'Do this',
      },
      data: {
        id: data._id,
      },
    };

    fcm.send(message, (err) => {
      if (err) {
        console.log('Something has gone wrong!', err);
      }
    });
  }

  async createPushListEvent(data) {
    const udid = (await udidWrite.findTokenById(data.member)).map(item => item.token);

    const message = {
      registration_ids: udid,
      collapse_key: 'your_collapse_key',
      notification: {
        title: `Create a list ${data.name}`,
        body: 'You create a new list',
      },
      data: {
        id: data._id,
      },
    };

    fcm.send(message, (err) => {
      if (err) {
        console.log('Something has gone wrong!', err);
      }
    });
  }
}

export default new notificationAction();
