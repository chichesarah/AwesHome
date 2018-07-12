import sharedListWrite from '../model/write/sharedList';
import eventBus from '../component/eventBus';

class SharedListAction {
  async create(name, ownerId, member, householdId) {
    const list = await sharedListWrite.create(name, ownerId, member, householdId);
    eventBus.emit('listCreate', list);
    return list;
  }

  async addItem(sharedList, userId) {
    const list = await sharedListWrite.addItem(sharedList);
    eventBus.emit('addItemToList', { list, userId, itemName: sharedList.name });
    return list;
  }

  async checkItem({ sharedListId, itemId }, userId) {
    const list = await sharedListWrite.checkItem(sharedListId, itemId);
    eventBus.emit('checkItemInList', { list, userId, itemId });
    return list;
  }

  async deleteSharedList(sharedListId, userId) {
    const list = await sharedListWrite.deleteSharedList(sharedListId);
    eventBus.emit('deleteList', { list, userId });
    return list;
  }

  getAllSharedList(userId) {
    return sharedListWrite.findAllSharedList(userId);
  }
}

export default new SharedListAction();
