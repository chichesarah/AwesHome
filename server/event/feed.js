import eventBus from '../component/eventBus';
import feedAction from '../action/feed';

eventBus.onSeries('listCreate', async (data, next) => {
  await feedAction.createListEvent(data);
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

eventBus.onSeries('deleteList', async (data, next) => {
  await feedAction.deleteListEvent(data);
  await next();
});

eventBus.onSeries('addTask', async (data, next) => {
  await feedAction.addTaskEvent(data);
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
