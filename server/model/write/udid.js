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

  findTokenById(userIdList) {
    return udidWrite.findRows({
      query: {
        userId: {
          $in: userIdList,
        },
      },
    });
  }
}

export default new UdidModel();
