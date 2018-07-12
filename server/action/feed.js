import _ from 'lodash';
import feedWrite from '../model/write/feed';
import userWrite from '../model/write/user';

class FeedAction {
  createListEvent(data) {
    return feedWrite.create({
      userId: data.ownerId,
      householdId: data.householdId,
      type: 'create list',
      operation: [
        {
          id: data._id,
          name: data.name,
          type: 'sharedList',
        },
      ],
    });
  }

  deleteListEvent(data) {
    return feedWrite.create({
      userId: data.userId,
      householdId: data.list.householdId,
      type: 'delete list',
      operation: [
        {
          id: data.list._id,
          name: data.list.name,
          type: 'sharedList',
        },
      ],
    });
  }

  addItemToListEvent(data) {
    const item = _.find(data.list.item, { name: data.itemName });

    return feedWrite.create({
      userId: data.userId,
      householdId: data.list.householdId,
      type: 'add listItem',
      operation: [
        {
          id: data.list._id,
          name: data.list.name,
          type: 'sharedList',
        },
        {
          id: item._id,
          name: item.name,
          type: 'sharedListItem',
        },
      ],
    });
  }

  checkItemInListEvent(data) {
    const item = _.find(data.list.item, i => i._id.toString() === data.itemId);

    return feedWrite.create({
      userId: data.userId,
      householdId: data.list.householdId,
      type: 'check listItem',
      operation: [
        {
          id: data.list._id,
          name: data.list.name,
          type: 'sharedList',
        },
        {
          id: item._id,
          name: item.name,
          type: 'sharedListItem',
        },
      ],
    });
  }

  async getAllFeed(userId) {
    const user = await userWrite.findById({ id: userId });

    return feedWrite.getAllFeed(user.householdId);
  }
}

export default new FeedAction();
