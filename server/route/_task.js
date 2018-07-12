import koaRouter from 'koa-router';

import { taskAction } from '../action/task';
import { taskValidate } from '../validator/task';
import { bearerMiddleware } from '../component/passport';
import middlewareWrapper from '../component/middlewareWrapper';

export const router = koaRouter({
  prefix: '/api/v1/task',
});

router.all('/*', bearerMiddleware);

/**
 * @apiDefine taskObject
 * @apiSuccess  {String}  _id           Task id
 * @apiSuccess  {String}  ownerId       Owner id
 * @apiSuccess  {String}  householdId   Household id
 * @apiSuccess  {String}  taskNameId    TaskName id
 * @apiSuccess  {String}  dueDate       Due date
 * @apiSuccess  {String}  repeat        How often this task will repeat
 * @apiSuccess  {Boolean} reminder      Need reminders
 * @apiSuccess  {String[]} assignee     Array of assigned users id
 * @apiSuccess  {String}  nextDate      Next date for task
 * @apiSuccess  {String}  [endDate]     Last date for task
 * @apiSuccess  {Boolean} isDeleted     Is task deleted
 * @apiSuccess  {String} createdAt      Task create date
 * @apiSuccess  {String} updatedAt      Task update date
*/

/**
  * @apiName CreateTask
  * @api {POST} /api/v1/task/create Create

  * @apiVersion 0.0.1

  * @apiGroup Task

  * @apiHeader {String} Content-Type=application/json Content-Type
  * @apiHeader {String} Authorization User bearer access token

  * @apiParam  {String}  taskNameId Task name id
  * @apiParam  {String}  dueDate    Due date
  * @apiParam  {String}  repeat     How often this task will repeat
  * @apiParam  {Boolean} [reminder] Need reminders
  * @apiParam  {String[]} assignee  Array of assigned users id

  * @apiExample {curl} Example usage:
  * curl -X POST /api/v1/task/create \
  *     -H 'authorization: Bearer HFWlsKleEJ3BV2IEpghcs8m+Kk5jx/i82VdF5UEfqG6b712dnpC3eFqP1ghTjwjd+wdDGlDHr2dBBErf8lLFgA93mS4nkNhzlha7P4DOl8QQVBkRNvx94HLtXByrNg==' \
  *     -H 'content-type: application/json' \
  *       -d '{"taskNameId": "5b45a2808c6938db26e57eb1","dueDate": "2018-07-12T06:27:17.279Z","repeat": "2 weeks","reminder": false,"assignee": ["5b45bad19d5566e98a57b60e", "5b436751d2a43e91d96a3dbc"]}'

  * @apiSuccessExample {json} Success-Response:
  {
    "createdAt": "2018-07-12T10:44:50.418Z",
    "updatedAt": "2018-07-12T10:44:50.418Z",
    "isDeleted": false,
    "_id": "5b4731227a3e5d3873af82ca",
    "ownerId": "5b45bad19d5566e98a57b60e",
    "householdId": "5b4483d3fc5523bcbc7999d0",
    "taskNameId": "5b45a2808c6938db26e57eb1",
    "dueDate": "2018-07-12T06:27:17.279Z",
    "repeat": "2 weeks",
    "reminder": false,
    "assignee": [
        "5b45bad19d5566e98a57b60e",
        "5b436751d2a43e91d96a3dbc"
    ],
    "nextDate": "2018-07-26T06:27:17.279Z"
  }

  * @apiUse taskObject

  * @apiErrorExample {json} Error-Response:
    [{param: 'taskNameId', message: 'Invalid taskName id'}]

  * @apiError {Object} InvalidTaskNameId {param: 'taskNameId', message: 'Invalid taskName id'}
  * @apiError {Object} DueDateRequired {param: 'dueDate', message: 'Due date is required'}
  * @apiError {Object} RepeatRequired {param: 'repeat', message: 'Valid repeat period is required'}
  * @apiError {Object} AssigneeRequired {param: 'assignee', message: 'Assignee is required'}
  * @apiError {Object} TaskNameNotFound {param: 'taskNameId', message: 'Task name not found'}
  * @apiError {Object} InvalidDueDate {param: 'dueDate', message: 'Invalid due date'}
  * @apiError {Object} InvalidAssignee {param: 'assignee', message: 'Not all members from the same household'}
  */

router.post('/create', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const reqData = await taskValidate.create(req.request.body, req.request.user);
    return await taskAction.create(reqData);
  });
});


/**
  * @apiName UpdateTask
  * @api {PUT} /api/v1/task/update Update

  * @apiVersion 0.0.1

  * @apiGroup Task

  * @apiHeader {String} Content-Type=application/json Content-Type
  * @apiHeader {String} Authorization User bearer access token

  * @apiParam  {String}   taskId       Task id
  * @apiParam  {String}   [dueDate]    Due date
  * @apiParam  {String}   [repeat]     How often this task will repeat
  * @apiParam  {Boolean}  [reminder]   Need reminders
  * @apiParam  {String[]} [assignee]   Array of assigned users id

  * @apiExample {curl} Example usage:
  * curl -X PUT /api/v1/task/update \
  *     -H 'authorization: Bearer HFWlsKleEJ3BV2IEpghcs8m+Kk5jx/i82VdF5UEfqG6b712dnpC3eFqP1ghTjwjd+wdDGlDHr2dBBErf8lLFgA93mS4nkNhzlha7P4DOl8QQVBkRNvx94HLtXByrNg==' \
  *     -H 'content-type: application/json' \
  *     -d '{"taskId": "5b47080b27f8fe2b4e7ae7c9","repeat": "day","reminder": true,"assignee": ["5b436751d2a43e91d96a3dbc", "5b45bad19d5566e98a57b60e"]}'

  * @apiSuccessExample {json} Success-Response:
  {
    "createdAt": "2018-07-12T07:49:31.594Z",
    "updatedAt": "2018-07-12T07:49:31.594Z",
    "isDeleted": false,
    "_id": "5b47080b27f8fe2b4e7ae7c9",
    "ownerId": "5b45bad19d5566e98a57b60e",
    "householdId": "5b4483d3fc5523bcbc7999d0",
    "taskNameId": "5b45a2808c6938db26e57eb1",
    "dueDate": "2018-07-12T06:27:17.279Z",
    "repeat": "day",
    "reminder": true,
    "assignee": [
        "5b436751d2a43e91d96a3dbc",
        "5b45bad19d5566e98a57b60e"
    ],
    "nextDate": "2018-07-13T06:27:17.279Z"
  }

  * @apiUse taskObject

  * @apiErrorExample {json} Error-Response:
    [{param: 'taskId', message: 'Invalid task id'}]

  * @apiError {Object} InvalidTaskId {param: 'taskId', message: 'Invalid task id'}
  * @apiError {Object} DueDateRequired {param: 'dueDate', message: 'Due date is required'}
  * @apiError {Object} RepeatRequired {param: 'repeat', message: 'Valid repeat period is required'}
  * @apiError {Object} InvalidReminder {param: 'reminder', message: 'Valid reminder is required'}
  * @apiError {Object} AssigneeRequired {param: 'assignee', message: 'Assignee is required'}
  * @apiError {Object} TaskNotFound {param: 'taskId', message: 'Task not found or user permission denied'}
  * @apiError {Object} InvalidDueDate {param: 'dueDate', message: 'Invalid due date'}
  * @apiError {Object} InvalidAssignee {param: 'assignee', message: 'Not all members from the same household'}
  */

router.put('/update', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const reqData = await taskValidate.update(req.request.body, req.request.user);
    return await taskAction.update(reqData);
  });
});


/**
  * @apiName DeleteTask
  * @api {DELETE} /api/v1/task/delete/{_id} Delete

  * @apiVersion 0.0.1

  * @apiGroup Task

  * @apiHeader {String} Authorization User bearer access token

  * @apiParam  {String} _id Task id

  * @apiExample {curl} Example usage:
  * curl -X DELETE /api/v1/task/delete/5b47080b27f8fe2b4e7ae7c9 \
  *     -H 'authorization: Bearer HFWlsKleEJ3BV2IEpghcs8m+Kk5jx/i82VdF5UEfqG6b712dnpC3eFqP1ghTjwjd+wdDGlDHr2dBBErf8lLFgA93mS4nkNhzlha7P4DOl8QQVBkRNvx94HLtXByrNg==' \

  * @apiSuccessExample {json} Success-Response:
  {
    "createdAt": "2018-07-12T07:49:31.594Z",
    "updatedAt": "2018-07-12T07:49:31.594Z",
    "isDeleted": true,
    "_id": "5b47080b27f8fe2b4e7ae7c9",
    "ownerId": "5b45bad19d5566e98a57b60e",
    "householdId": "5b4483d3fc5523bcbc7999d0",
    "taskNameId": "5b45a2808c6938db26e57eb1",
    "dueDate": "2018-07-12T06:27:17.279Z",
    "repeat": "day",
    "reminder": true,
    "assignee": [
        "5b436751d2a43e91d96a3dbc",
        "5b45bad19d5566e98a57b60e"
    ],
    "nextDate": "2018-07-13T06:27:17.279Z",
    "endDate": "2018-07-12T06:27:17.279Z"
  }

  * @apiUse taskObject

  * @apiErrorExample {json} Error-Response:
    [{param: 'taskId', message: 'Invalid task id'}]

  * @apiError {Object} InvalidTaskId {param: 'taskId', message: 'Invalid task id'}
  * @apiError {Object} TaskNotFound {param: 'taskId', message: 'Task not found or user permission denied'}
  */

router.delete('/delete/:_id', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const reqData = await taskValidate.delete(req.params, req.request.user);
    return await taskAction.delete(reqData);
  });
});


/**
  * @apiName CompleteTask
  * @api {PUT} /api/v1/task/complete/{_id} Complete

  * @apiVersion 0.0.1

  * @apiGroup Task

  * @apiHeader {String} Authorization User bearer access token

  * @apiParam  {String} _id Task id

  * @apiExample {curl} Example usage:
  * curl -X PUT /api/v1/task/complete/5b46e8d1885dd218b239ad8e \
  *     -H 'authorization: Bearer HFWlsKleEJ3BV2IEpghcs8m+Kk5jx/i82VdF5UEfqG6b712dnpC3eFqP1ghTjwjd+wdDGlDHr2dBBErf8lLFgA93mS4nkNhzlha7P4DOl8QQVBkRNvx94HLtXByrNg==' \

  * @apiSuccessExample {json} Success-Response:
  {
    "createdAt": "2018-07-12T05:36:17.900Z",
    "updatedAt": "2018-07-12T05:36:17.900Z",
    "isDeleted": false,
    "_id": "5b46e8d1885dd218b239ad8e",
    "ownerId": "5b45bad19d5566e98a57b60e",
    "householdId": "5b4483d3fc5523bcbc7999d0",
    "taskNameId": "5b45a2808c6938db26e57eb1",
    "dueDate": "2018-07-11T06:27:17.279Z",
    "repeat": "week",
    "reminder": false,
    "assignee": [
        "5b45bad19d5566e98a57b60e"
    ],
    "nextDate": "2018-07-19T06:27:17.279Z",
    "endDate": "2018-10-12T06:27:17.279Z"
  }

  * @apiUse taskObject

  * @apiErrorExample {json} Error-Response:
    [{param: 'taskId', message: 'Invalid task id'}]

  * @apiError {Object} InvalidTaskId {param: 'taskId', message: 'Invalid task id'}
  * @apiError {Object} TaskNotFound {param: 'taskId', message: 'Task not found or user permission denied'}
  * @apiError {Object} InvalidTaskDateForComlete {param: 'taskId', message: 'Cant complete task today'}
  */

router.put('/complete/:_id', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const reqData = await taskValidate.complete(req.params, req.request.user);
    return await taskAction.complete(reqData);
  });
});

router.get('/all', async (req, next) => {
  await middlewareWrapper.wrape(req, next, () => taskAction.getByHousehold(req.request.user));
});

router.get('/my', async (req, next) => {
  await middlewareWrapper.wrape(req, next, () => taskAction.getByAssignedUser(req.request.user));
});
