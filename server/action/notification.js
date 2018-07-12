import _ from 'lodash';
// import notificationWrite from '../model/write/notification';
// const admin = require('firebase-admin');
const FCM = require('fcm-node');

// const serviceAccount = require('../../serviceAccountKey.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://awesomehome-91c1f.firebaseio.com',
// });

const serverKey = 'AAAA81gJKgA:APA91bGEvRXL28V9ClnPW3lbRtHUcKVWjumNT6YgUQfaOvVM8F1_h5bTDtxhlHhvYVBEItbCrm5e3UpRE19ARTw3tdw_BUHyr6AWFSj0DDHqNk6ffwCYXdSYwYMfn7HQpDNtC6mdpPLwiKEVm1X893iLkKFcY2kbOg';
const fcm = new FCM(serverKey);

const message = { // this may vary according to the message type (single recipient, multicast, topic, et cetera)
  to: '/topics/highScores',
  collapse_key: 'your_collapse_key',
  notification: {
    title: 'Title of your push notification',
    body: 'Body of your push notification',
  },
};

// const myToken = 'AAAA81gJKgA:APA91bGEvRXL28V9ClnPW3lbRtHUcKVWjumNT6YgUQfaOvVM8F1_h5bTDtxhlHhvYVBEItbCrm5e3UpRE19ARTw3tdw_BUHyr6AWFSj0DDHqNk6ffwCYXdSYwYMfn7HQpDNtC6mdpPLwiKEVm1X893iLkKFcY2kbOg';

// const message = {
//   notification: {
//     title: '$GOOG up 1.43% on the day',
//     body: '$GOOG gained 11.80 points to close at 835.67, up 1.43% on the day.',
//   },
//   token: myToken,
// };

class NotificationAction {
  // async createTaskEvent(data) {
  //   const res = await admin.messaging().send(message);
  //   console.log('res', res);
  // }

  createTaskEvent(data) {
    fcm.send(message, function(err, response){
      if (err) {
          console.log("Something has gone wrong!", err);
      } else {
          console.log("Successfully sent with response: ", response);
      }
    });
  }
}

export default new NotificationAction();
