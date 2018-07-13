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
    };

    fcm.send(message, (err) => {
      if (err) {
        console.log('Something has gone wrong!', err);
      }
    });
  }

  createListEvent(data) {
    console.log('data', data)
    const message = {
      to: '/topics/highScores',
      collapse_key: 'your_collapse_key',
      notification: {
        title: 'Create a list',
        body: 'You create a new list',
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
