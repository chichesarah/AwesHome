import sharedListWrite from '../model/write/sharedList';

class SharedListAction {
  create(name, ownerId, member) {
    return sharedListWrite.create(name, ownerId, member);
  }

  addItem(listId, memberId, name) {
    return sharedListWrite.addItem(listId, memberId, name);
  }
}

export default new SharedListAction();
