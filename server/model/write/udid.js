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

  async findTokenById(userIdList) {
    const result = await udidWrite.findRows({
      query: {
        userId: {
          $in: userIdList,
        },
      },
    });

    return result;
  }

  async deleteOldToken(token) {
    const udidToken = await udidWrite.findRow({
      query: {
        token,
      },
    });

    if (udidToken) {
      await udidWrite.deleteRow({
        query: {
          token,
        },
      });

      return udidToken.token;
    }

    return token;
  }
}

export default new UdidModel();
