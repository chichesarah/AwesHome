import eventBus from '../component/eventBus';
import notificationAction from '../action/notification';

eventBus.onSeries('pushCreateTask', async (data, next) => {
  await notificationAction.createTaskEvent(data);
  await next();
});
