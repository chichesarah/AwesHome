import udidWrite from '../model/write/udid';

class UdidAction {
  async create(token, userId) {
    const udidToken = await udidWrite.deleteOldToken(token);

    return udidWrite.create(udidToken, userId);
  }

  delete(_id) {
    return udidWrite.delete(_id);
  }
}

export default new UdidAction();
