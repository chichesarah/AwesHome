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
}

export default new SharedListModel();
