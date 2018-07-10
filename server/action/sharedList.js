import sharedListWrite from '../model/write/sharedList';

class SharedListAction {
  create(name, ownerId, member) {
    return sharedListWrite.create(name, ownerId, member);
  }
}

export default new SharedListAction();
