import udidWrite from '../model/write/udid';

class UdidAction {
  create(token, userId) {
    return udidWrite.create(token, userId);
  }
}

export default new UdidAction();
