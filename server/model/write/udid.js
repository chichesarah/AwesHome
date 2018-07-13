import _ from 'lodash';
import dbList from './../../db';

const udidWrite = dbList.write('udid');

class UdidModel {
  create(token, userId) {
    return udidWrite.insertRow({
      data: {
        token,
        userId,
      },
    });
  }

  findTokenById(_id) {
    return udidWrite.findRows({
      query: {
        _id,
      },
    });
  }
}

export default new UdidModel();
