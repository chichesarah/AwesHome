import eventBus from '../component/eventBus';
import feedAction from '../action/feed';
import notificationAction from '../action/notification';

eventBus.onSeries('listCreate', async (data, next) => {
  await feedAction.createListEvent(data);
  await notificationAction.createPushListEvent(data);
  await next();
});

eventBus.onSeries('addItemToList', async (data, next) => {
  await feedAction.addItemToListEvent(data);
  await next();
});

eventBus.onSeries('checkItemInList', async (data, next) => {
  await feedAction.checkItemInListEvent(data);
  await next();
});

eventBus.onSeries('unCheckItemInList', async (data, next) => {
  await feedAction.unCheckItemInListEvent(data);
  await next();
});

eventBus.onSeries('deleteList', async (data, next) => {
  await feedAction.deleteListEvent(data);
  await next();
});

eventBus.onSeries('addTask', async (data, next) => {
  await feedAction.addTaskEvent(data);
  await notificationAction.addPushTaskEvent(data);
  await next();
});

eventBus.onSeries('taskToNextMember', async (data, next) => {
  await notificationAction.pushToNextMember(data);
  await next();
});

eventBus.onSeries('assigneeToTask', async (data, next) => {
  await notificationAction.assigneePushTaskEvent(data);
  await next();
});

eventBus.onSeries('soonEndTask', async (data, next) => {
  await notificationAction.pushNotificationEndTask(data);
  await next();
});

eventBus.onSeries('completeTask', async (data, next) => {
  await feedAction.completeTaskEvent(data);
  await next();
});

eventBus.onSeries('deleteTask', async (data, next) => {
  await feedAction.deleteTaskEvent(data);
  await next();
});

eventBus.onSeries('createEventObj', async (data, next) => {
  await feedAction.createEventObj(data);
  await notificationAction.createPushEventObj(data);
  await next();
});

eventBus.onSeries('deleteEventObj', async (data, next) => {
  await feedAction.deleteEventObj(data);
  await next();
});

eventBus.onSeries('addGuestPushEventObj', async (data, next) => {
  await notificationAction.addNewGuestPushEventObj(data);
  await next();
});

eventBus.onSeries('joinHousehold', async (data, next) => {
  await feedAction.joinHousehold(data);
  await next();
});

eventBus.onSeries('leaveHousehold', async (data, next) => {
  await feedAction.leaveHousehold(data);
  await next();
});
