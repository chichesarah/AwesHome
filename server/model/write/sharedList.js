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
}

export default new SharedListModel();
