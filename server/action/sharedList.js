import sharedListWrite from '../model/write/sharedList';

class SharedListAction {
  create(name, ownerId, member) {
    return sharedListWrite.create(name, ownerId, member);
  }

  addItem(sharedListId, memberId, name) {
    return sharedListWrite.addItem(sharedListId, memberId, name);
  }

  checkItem({ sharedListId, itemId }) {
    return sharedListWrite.checkItem(sharedListId, itemId);
  }

  deleteSharedList(sharedListId) {
    return sharedListWrite.deleteSharedList(sharedListId);
  }

  getAllSharedList(userId) {
    return sharedListWrite.findAllSharedList(userId);
  }
}

export default new SharedListAction();
