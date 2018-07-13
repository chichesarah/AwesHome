import udidWrite from '../model/write/udid';

class UdidAction {
  async create(token, userId) {
    const udidToken = await udidWrite.deleteOldToken(token);

    return udidWrite.create(udidToken, userId);
  }
}

export default new UdidAction();
