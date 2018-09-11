import dbList from './../../db';

const udidWrite = dbList.write('udid');

class UdidModel {
  create(data, userId) {
    return udidWrite.insertRow({
      data: {
        token: data.token,
        type: data.type,
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

  findUdidByToken(token) {
    return udidWrite.findRow({
      query: {
        token,
      },
    });
  }

  findUdidById(_id) {
    return udidWrite.findRow({
      query: {
        _id,
      },
    });
  }

  update(data) {
    return udidWrite.updateRow({
      query: {
        _id: data._id,
      },
      data: {
        token: data.newToken,
      },
    });
  }

  delete(_id) {
    return udidWrite.deleteRow({
      query: {
        _id,
      },
    });
  }

  async deleteOldToken(data) {
    const udidToken = await udidWrite.findRow({
      query: {
        token: data.token,
      },
    });

    if (udidToken) {
      await udidWrite.deleteRow({
        query: {
          token: data.token,
        },
      });

      return udidToken;
    }

    return data;
  }
}

export default new UdidModel();
