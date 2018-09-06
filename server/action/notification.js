import config from '../config';
import udidWrite from '../model/write/udid';
import userWrite from '../model/write/user';

const FCM = require('fcm-node');

const fcm = new FCM(config.notification.serverKey);

class notificationAction {
  async addPushTaskEvent(data) {
    const udid = (await udidWrite.findTokenById(data.assignee)).map(
      item => item.token,
    );

    const message = {
      registration_ids: udid,
      notification: {
        title: `Hey! You’ve been assigned to the task ${
          data.taskName
        } 🙂. Don’t forget to complete it before dueDate.`,
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
    const udid = (await udidWrite.findTokenById(data.member)).map(
      item => item.token,
    );
    const user = await userWrite.findById(data.ownerId);

    const message = {
      registration_ids: udid,
      collapse_key: 'your_collapse_key',
      notification: {
        title: `- ${user.firstName} ${user.lastName} created the list ${
          data.name
        }.`,
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

  async createPushEventObj(data) {
    const udid = (await udidWrite.findTokenById(data.member)).map(
      item => item.token,
    );
    const user = await userWrite.findById(data.ownerId);

    const message = {
      registration_ids: udid,
      collapse_key: 'your_collapse_key',
      notification: {
        title: `- ${user.firstName} ${user.lastName} added ${data.title}.`,
      },
      data: {
        id: data._id,
      },
    };

    if (data.notify) {
      fcm.send(message, (err) => {
        if (err) {
          console.log('Something has gone wrong!', err);
        }
      });
    }
  }

  async addNewGuestPushEventObj(data) {
    const udid = (await udidWrite.findTokenById(data.newMember)).map(
      item => item.token,
    );

    const message = {
      registration_ids: udid,
      collapse_key: 'your_collapse_key',
      notification: {
        title: `Create a event ${data.event.title}`,
      },
      data: {
        id: data.event._id,
      },
    };

    if (data.event.notify) {
      fcm.send(message, (err) => {
        if (err) {
          console.log('Something has gone wrong!', err);
        }
      });
    }
  }
}

export default new notificationAction();
