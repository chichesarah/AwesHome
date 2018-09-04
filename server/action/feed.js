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

  unCheckItemInListEvent(data) {
    const item = _.find(data.list.item, i => i._id.toString() === data.itemId);

    return feedWrite.create({
      userId: data.userId,
      householdId: data.list.householdId,
      type: 'unCheck listItem',
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

  addTaskEvent(data) {
    return feedWrite.create({
      userId: data.ownerId,
      householdId: data.householdId,
      type: 'add task',
      operation: [
        {
          id: data._id,
          name: data.taskName,
          type: 'task',
        },
      ],
    });
  }

  completeTaskEvent(data) {
    return feedWrite.create({
      userId: data.ownerId,
      householdId: data.householdId,
      type: 'complete task',
      operation: [
        {
          id: data._id,
          name: data.taskName,
          type: 'task',
        },
      ],
    });
  }

  deleteTaskEvent(data) {
    return feedWrite.create({
      userId: data.ownerId,
      householdId: data.householdId,
      type: 'delete task',
      operation: [
        {
          id: data._id,
          name: data.taskName,
          type: 'task',
        },
      ],
    });
  }

  createEventObj(data) {
    return feedWrite.create({
      userId: data.ownerId,
      householdId: data.householdId,
      type: 'add event',
      operation: [
        {
          id: data._id,
          name: data.title,
          type: 'event',
        },
      ],
    });
  }

  deleteEventObj(data) {
    return feedWrite.create({
      userId: data.ownerId,
      householdId: data.householdId,
      type: 'delete event',
      operation: [
        {
          id: data._id,
          name: data.title,
          type: 'event',
        },
      ],
    });
  }

  joinHousehold(data) {
    return feedWrite.create({
      userId: data._id,
      householdId: data.householdId,
      type: 'join household',
      operation: [
        {
          id: data._id,
          name: data.neighbourhood,
          type: 'household',
        },
      ],
    });
  }

  leaveHousehold(data) {
    return feedWrite.create({
      userId: data._id,
      householdId: data.householdId,
      type: 'leave household',
      operation: [
        {
          id: data._id,
          name: data.neighbourhood,
          type: 'household',
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
