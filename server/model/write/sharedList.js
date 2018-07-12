import _ from 'lodash';
import dbList from './../../db';

const sharedListWrite = dbList.write('sharedList');

class SharedListModel {
  create(name, ownerId, member) {
    return sharedListWrite.insertRow({
      data: {
        name,
        ownerId,
        member,
      },
    });
  }

  findByName(name) {
    return sharedListWrite.findRow({
      query: {
        name,
        isDeleted: false,
      },
    });
  }

  findById(id) {
    return sharedListWrite.findRow({
      query: {
        _id: id,
      },
    });
  }

  async addItem(item) {
    const sharedList = await sharedListWrite.findRow({
      query: {
        _id: item.sharedListId,
        isDeleted: false,
      },
    });

    sharedList.item.push(item);

    const result = await sharedListWrite.updateRow({
      query: {
        _id: item.sharedListId,
      },
      data: sharedList,
    });

    return result;
  }

  async checkItem(sharedListId, itemId) {
    const sharedList = await sharedListWrite.findRow({
      query: {
        _id: sharedListId,
        isDeleted: false,
      },
    });

    const itemObj = _.find(sharedList.item, i => i._id.toString() === itemId);
    itemObj.status = true;

    const result = await sharedListWrite.updateRow({
      query: {
        _id: sharedListId,
      },
      data: sharedList,
    });

    return result;
  }

  deleteSharedList(_id) {
    return sharedListWrite.deleteRow({
      query: {
        _id,
      },
    });
  }

  findAllSharedList(userId) {
    return sharedListWrite.findRows({
      query: {
        member: {
          $eq: userId,
        },
      },
    });
  }
}

export default new SharedListModel();
