import config from '../config';

const FCM = require('fcm-node');

const fcm = new FCM(config.notification.serverKey);

class notificationAction {
  addPushTaskEvent(data) {

    // const udid = udidWrite.findTokenById()

    console.log('data', data)
    const message = { // this may vary according to the message type (single recipient, multicast, topic, et cetera)
      to: '/topics/highScores',
      collapse_key: 'your_collapse_key',
      notification: {
        title: `Create a task ${data.taskNaem}`,
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
    const message = { // thiszmay vary according to the message type (single recipient, multicast, topic, et cetera)
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
