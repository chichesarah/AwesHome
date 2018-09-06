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
 * @apiSuccess  {String}  rotate        rotate
 * @apiSuccess  {String}  startIndex    startIndex
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
  * @apiUse accessTokenError
  */

router.post('/create', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const reqData = await taskValidate.create(req.request.body, req.request.user);
    return taskAction.create(reqData);
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
  * @apiParam  {String}   [rotate]     rotate
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
  * @apiUse accessTokenError
  */

router.put('/update', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const reqData = await taskValidate.update(req.request.body, req.request.user);
    return taskAction.update(reqData);
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
  * @apiUse accessTokenError
  */

router.delete('/delete/:_id', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const reqData = await taskValidate.delete(req.params, req.request.user);
    return taskAction.delete(reqData);
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
  * @apiUse accessTokenError
  */

router.put('/complete/:_id', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const reqData = await taskValidate.complete(req.params, req.request.user);
    return taskAction.complete(reqData);
  });
});

/**
  * @apiName GetAllHouseholdTasks
  * @api {GET} /api/v1/task/all Get all tasks for the user household

  * @apiVersion 0.0.1

  * @apiGroup Task

  * @apiHeader {String} Authorization User bearer access token

  * @apiExample {curl} Example usage:
  * curl -X GET /api/v1/task/all \
  *     -H 'authorization: Bearer HFWlsKleEJ3BV2IEpghcs8m+Kk5jx/i82VdF5UEfqG6b712dnpC3eFqP1ghTjwjd+wdDGlDHr2dBBErf8lLFgA93mS4nkNhzlha7P4DOl8QQVBkRNvx94HLtXByrNg=='
  * @apiSuccessExample {json} Success-Response:
  [
    {
      "_id": "5b681a93d4ece94de555938c",
      "isDeleted": false,
      "owner": {
        "_id": "5b681587d4ece94de5559380",
        "isDeleted": false,
        "avatarId": null,
        "firstName": "First name",
        "lastName": "Last name",
        "createdAt": "2018-08-06T09:31:51.620Z",
        "updatedAt": "2018-08-06T09:31:51.620Z"
      },
      "householdId": "5b68163ed4ece94de5559386",
      "reminder": false,
      "nextDate": "2018-08-11T21:00:00.000Z",
      "endDate": null,
      "assignee": [
        {
          "_id": "5b6815d7d4ece94de5559382",
          "isDeleted": false,
          "avatarId": null,
          "firstName": "First name1",
          "lastName": "Last name1",
          "createdAt": "2018-08-06T09:33:11.827Z",
          "updatedAt": "2018-08-06T09:33:11.827Z"
        },
        {
          "_id": "5b6815e9d4ece94de5559384",
          "isDeleted": false,
          "avatarId": null,
          "firstName": "First name2",
          "lastName": "Last name2",
          "createdAt": "2018-08-06T09:33:29.016Z",
          "updatedAt": "2018-08-06T09:33:29.016Z"
        }
      ],
      "taskNameId": "5b681737d4ece94de555938b",
      "dueDate": "2018-08-11T21:00:00.000Z",
      "repeat": "Every week",
      "taskName": "test name",
      "createdAt": "2018-08-06T09:53:23.198Z",
      "updatedAt": "2018-08-06T09:53:23.198Z"
    }
  ]
 * @apiSuccess  {Object[]}  .                  Task array
 * @apiSuccess  {String}  ._id                 Task id
 * @apiSuccess  {Object}  .owner               Owner
 * @apiSuccess  {String} .owner._id            Users id
 * @apiSuccess  {String} .owner.email          Email
 * @apiSuccess  {String} [.owner.avatar]       avatar
 * @apiSuccess  {String} .owner.lastName       Last name
 * @apiSuccess  {String} .owner.firstName      First name
 * @apiSuccess  {String} .owner.createdAt      User create date
 * @apiSuccess  {String} .owner.updatedAt      User update date
 *
 * @apiSuccess  {String}  .householdId         Household id
 * @apiSuccess  {String}  .taskNameId          TaskName id
 * @apiSuccess  {String}  .dueDate             Due date
 * @apiSuccess  {String}  .repeat              How often this task will repeat
 * @apiSuccess  {Boolean} .reminder            Need reminders
 * @apiSuccess  {Object[]} .assignee           Array of assigned users id
 * @apiSuccess  {String} .assignee._id         Users id
 * @apiSuccess  {String} .assignee.email       Email
 * @apiSuccess  {String} [.assignee.avatar]    avatar
 * @apiSuccess  {String} .assignee.lastName    Last name
 * @apiSuccess  {String} .assignee.firstName   First name
 * @apiSuccess  {String} .assignee.createdAt   User create date
 * @apiSuccess  {String} .assignee.updatedAt   User update date
 * @apiSuccess  {String} .nextDate             Next date for task
 * @apiSuccess  {String} [.endDate]            Last date for task
 * @apiSuccess  {Boolean} .isDeleted           Is task deleted
 * @apiSuccess  {String} .createdAt            Task create date
 * @apiSuccess  {String} .updatedAt            Task update date

  * @apiErrorExample {json} Error-Response:
    [{param: 'taskId', message: 'Invalid task id'}]

  * @apiUse accessTokenError
  */

router.get('/all', async (req, next) => {
  await middlewareWrapper.wrape(req, next, () => taskAction.getByHousehold(req.request.user));
});


/**
  * @apiName GetAllTasksAssignedToUser
  * @api {GET} /api/v1/task/my Get all tasks assigned to the user

  * @apiVersion 0.0.1

  * @apiGroup Task

  * @apiHeader {String} Authorization User bearer access token

  * @apiExample {curl} Example usage:
  * curl -X GET /api/v1/task/all \
  *     -H 'authorization: Bearer HFWlsKleEJ3BV2IEpghcs8m+Kk5jx/i82VdF5UEfqG6b712dnpC3eFqP1ghTjwjd+wdDGlDHr2dBBErf8lLFgA93mS4nkNhzlha7P4DOl8QQVBkRNvx94HLtXByrNg=='

  * @apiSuccessExample {json} Success-Response:
  [
    {
      "_id": "5b681a93d4ece94de555938c",
      "isDeleted": false,
      "owner": {
        "_id": "5b681587d4ece94de5559380",
        "isDeleted": false,
        "firstName": "First name",
        "lastName": "Last name",
        "createdAt": "2018-08-06T09:31:51.620Z",
        "updatedAt": "2018-08-06T09:31:51.620Z"
      },
      "householdId": "5b68163ed4ece94de5559386",
      "reminder": false,
      "nextDate": "2018-08-11T21:00:00.000Z",
      "endDate": null,
      "assignee": [
        {
          "_id": "5b6815d7d4ece94de5559382",
          "isDeleted": false,
          "firstName": "First name1",
          "lastName": "Last name1",
          "createdAt": "2018-08-06T09:33:11.827Z",
          "updatedAt": "2018-08-06T09:33:11.827Z"
        },
        {
          "_id": "5b6815e9d4ece94de5559384",
          "isDeleted": false,
          "firstName": "First name2",
          "lastName": "Last name2",
           "createdAt": "2018-08-06T09:33:29.016Z",
           "updatedAt": "2018-08-06T09:33:29.016Z"
        }
      ],
      "taskNameId": "5b681737d4ece94de555938b",
      "dueDate": "2018-08-11T21:00:00.000Z",
      "repeat": "Every week",
      "taskName": "test name",
      "createdAt": "2018-08-06T09:53:23.198Z",
      "updatedAt": "2018-08-06T09:53:23.198Z"
    }
  ]

 * @apiSuccess  {Object[]}  .                  Task array
 * @apiSuccess  {String}  ._id                 Task id
 * @apiSuccess  {Object}  .owner               Owner
 * @apiSuccess  {String} .owner._id            Users id
 * @apiSuccess  {String} .owner.email          Email
 * @apiSuccess  {String} [.owner.avatar]       avatar
 * @apiSuccess  {String} .owner.lastName       Last name
 * @apiSuccess  {String} .owner.firstName      First name
 * @apiSuccess  {String} .owner.createdAt      User create date
 * @apiSuccess  {String} .owner.updatedAt      User update date
 *
 * @apiSuccess  {String}  .householdId         Household id
 * @apiSuccess  {String}  .taskNameId          TaskName id
 * @apiSuccess  {String}  .dueDate             Due date
 * @apiSuccess  {String}  .repeat              How often this task will repeat
 * @apiSuccess  {Boolean} .reminder            Need reminders
 * @apiSuccess  {Object[]} .assignee           Array of assigned users id
 * @apiSuccess  {String} .assignee._id         Users id
 * @apiSuccess  {String} .assignee.email       Email
 * @apiSuccess  {String} [.assignee.avatar]    avatar
 * @apiSuccess  {String} .assignee.lastName    Last name
 * @apiSuccess  {String} .assignee.firstName   First name
 * @apiSuccess  {String} .assignee.createdAt   User create date
 * @apiSuccess  {String} .assignee.updatedAt   User update date
 * @apiSuccess  {String} .nextDate             Next date for task
 * @apiSuccess  {String} [.endDate]            Last date for task
 * @apiSuccess  {Boolean} .isDeleted           Is task deleted
 * @apiSuccess  {String} .createdAt            Task create date
 * @apiSuccess  {String} .updatedAt            Task update date

  * @apiErrorExample {json} Error-Response:
    [{param: 'taskId', message: 'Invalid task id'}]

  * @apiUse accessTokenError
  */

router.get('/my', async (req, next) => {
  await middlewareWrapper.wrape(req, next, () => taskAction.getByAssignedUser(req.request.user));
});
