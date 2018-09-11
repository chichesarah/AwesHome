import udidWrite from '../model/write/udid';

class UdidAction {
  async create(data, userId) {
    const udidToken = await udidWrite.deleteOldToken(data);

    return udidWrite.create(udidToken, userId);
  }

  update(data) {
    return udidWrite.update(data);
  }

  delete(_id) {
    return udidWrite.delete(_id);
  }
}

export default new UdidAction();
