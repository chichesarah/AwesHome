import koaRouter from 'koa-router';

import { calendarAction } from '../action/calendar';
import { calendarValidate } from '../validator/calendar';
import { bearerMiddleware } from '../component/passport';
import middlewareWrapper from '../component/middlewareWrapper';

export const router = koaRouter({
  prefix: '/api/v1/calendar',
});

router.all('/*', bearerMiddleware);


/**
  * @apiName GetTasksForCalendar
  * @api {GET} /api/v1/calendar/tasks Get tasks for calendar by period

  * @apiVersion 0.0.1

  * @apiGroup Calendar

  * @apiHeader {String} Authorization User bearer access token

  * @apiParam  {String} startDate   Start date of period
  * @apiParam  {String} endDate     End date of period

  * @apiExample {curl} Example usage:
  * curl -X GET \
  *   'http://localhost:3000/api/v1/calendar/task?startDate=2018-07-01T08%3A27%3A17.279Z&endDate=2018-08-01T20%3A27%3A17.279Z' \
  *     -H 'authorization: Bearer xhGGqLk6e7/1PAm/Egi5Rl2PD7dYm7Xmz4D7PzaNdbZt5WCcllKDFCEG0tjs5Y4TzL0jYXVLSa2YBX9bAuMuPlRmQn5ZbVhIl2v1h20vzYjXFGRRP4mfgJhJm3iWxQ==' \

  * @apiSuccessExample {json} Success-Response:
  {
    "2018-07-10": [
        {
            "_id": "5b4c5b9bc9d067f47f085664",
            "type": "task"
        },
        {
            "_id": "5b4c6dc2c9d067f47f085673",
            "type": "task"
        }
    ],
    "2018-07-30": [
        {
            "_id": "5b4c6d58c9d067f47f08566d",
            "type": "task"
        },
        {
            "_id": "5b4c6dc2c9d067f47f085673",
            "type": "task"
        }
    ],
    "2018-07-14": [
        {
            "_id": "5b4c6d74c9d067f47f085670",
            "type": "task"
        },
        {
            "_id": "5b4c6dc2c9d067f47f085673",
            "type": "task"
        }
    ],
    "2018-07-28": [
        {
            "_id": "5b4c6d74c9d067f47f085670",
            "type": "task"
        },
        {
            "_id": "5b4c6dc2c9d067f47f085673",
            "type": "task"
        }
    ]
  }

  * @apiSuccess  {Object}    tasks        List of tasks grouped by date (in format YYYY-MM-DD)
  * @apiSuccess  {Object[]}  task         Array of object with taskId and type for this day
  * @apiSuccess  {String}    task._id     Task id
  * @apiSuccess  {String}    task.type    Type can be 'task' or 'event'

  * @apiErrorExample {json} Error-Response:
    [{param: 'startDate', message: 'Start date is required'}]

  * @apiError {Object} StartDateRequired {param: 'startDate', message: 'Start date is required'}
  * @apiError {Object} EndDateRequired {param: 'endDate', message: 'End date is required'}
  * @apiUse accessTokenError
  */

router.get('/task', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const reqData = await calendarValidate.duration(req.query, req.request.user);
    return calendarAction.getTasks(reqData);
  });
});

/**
  * @apiName GetFullTasksInfoForCalendar
  * @api {GET} /api/v1/calendar/fulltask Get full tasks info for calendar by period

  * @apiVersion 0.0.1

  * @apiGroup Calendar

  * @apiHeader {String} Authorization User bearer access token

  * @apiParam  {String} startDate   Start date of period
  * @apiParam  {String} endDate     End date of period

  * @apiExample {curl} Example usage:
  * curl -X GET \
  *   'http://localhost:3000/api/v1/calendar/task?startDate=2018-07-01T08%3A27%3A17.279Z&endDate=2018-08-01T20%3A27%3A17.279Z' \
  *     -H 'authorization: Bearer xhGGqLk6e7/1PAm/Egi5Rl2PD7dYm7Xmz4D7PzaNdbZt5WCcllKDFCEG0tjs5Y4TzL0jYXVLSa2YBX9bAuMuPlRmQn5ZbVhIl2v1h20vzYjXFGRRP4mfgJhJm3iWxQ==' \

  * @apiSuccessExample {json} Success-Response:
  {
    "2018-07-10": [
        {
            "_id": "5b4c5b9bc9d067f47f085664",
            "type": "task",
            "object": {
                "_id": "5b4c5b9bc9d067f47f085664",
                "isDeleted": false,
                "householdId": "5b4483d3fc5523bcbc7999d0",
                "reminder": false,
                "assignee": [
                    "5b45bad19d5566e98a57b60e",
                    "5b436751d2a43e91d96a3dbc"
                ],
                "nextDate": "2018-07-17T00:00:00.000Z",
                "endDate": "2018-07-17T00:00:00.000Z",
                "taskNameId": "5b4c35c49f86bd91814980cd",
                "dueDate": "2018-07-10T00:00:00.000Z",
                "repeat": "week",
                "ownerId": "5b45bad19d5566e98a57b60e",
                "taskName": "Buy food",
                "createdAt": "2018-07-16T08:47:23.190Z",
                "updatedAt": "2018-07-16T08:47:23.190Z",
                "__v": 0
            }
        },
    ],
    "2018-07-20": [
        {
            "_id": "5b4c6dc2c9d067f47f085673",
            "type": "task",
            "object": {
                "_id": "5b4c6dc2c9d067f47f085673",
                "isDeleted": false,
                "householdId": "5b4483d3fc5523bcbc7999d0",
                "reminder": false,
                "assignee": [
                    "5b45bad19d5566e98a57b60e",
                    "5b436751d2a43e91d96a3dbc"
                ],
                "nextDate": "2018-08-16T00:00:00.000Z",
                "endDate": "2018-08-16T00:00:00.000Z",
                "taskNameId": "5b4c35c49f86bd91814980cd",
                "dueDate": "2018-06-16T00:00:00.000Z",
                "repeat": "day",
                "ownerId": "5b45bad19d5566e98a57b60e",
                "taskName": "Buy food",
                "createdAt": "2018-07-16T10:04:50.180Z",
                "updatedAt": "2018-07-16T10:04:50.180Z",
                "__v": 0
            }
        }
    ],
    "2018-07-16": [
        {
            "_id": "5b4c6d58c9d067f47f08566d",
            "type": "task",
            "object": {
                "_id": "5b4c6d58c9d067f47f08566d",
                "isDeleted": false,
                "householdId": "5b4483d3fc5523bcbc7999d0",
                "reminder": false,
                "assignee": [
                    "5b45bad19d5566e98a57b60e",
                    "5b436751d2a43e91d96a3dbc"
                ],
                "nextDate": "2018-07-16T00:00:00.000Z",
                "endDate": null,
                "taskNameId": "5b4c35c49f86bd91814980cd",
                "dueDate": "2018-07-16T00:00:00.000Z",
                "repeat": "week",
                "ownerId": "5b45bad19d5566e98a57b60e",
                "taskName": "Buy food",
                "createdAt": "2018-07-16T10:03:04.378Z",
                "updatedAt": "2018-07-16T10:03:04.378Z",
                "__v": 0
            }
        },
        {
            "_id": "5b4c6dc2c9d067f47f085673",
            "type": "task",
            "object": {
                "_id": "5b4c6dc2c9d067f47f085673",
                "isDeleted": false,
                "householdId": "5b4483d3fc5523bcbc7999d0",
                "reminder": false,
                "assignee": [
                    "5b45bad19d5566e98a57b60e",
                    "5b436751d2a43e91d96a3dbc"
                ],
                "nextDate": "2018-08-16T00:00:00.000Z",
                "endDate": "2018-08-16T00:00:00.000Z",
                "taskNameId": "5b4c35c49f86bd91814980cd",
                "dueDate": "2018-06-16T00:00:00.000Z",
                "repeat": "day",
                "ownerId": "5b45bad19d5566e98a57b60e",
                "taskName": "Buy food",
                "createdAt": "2018-07-16T10:04:50.180Z",
                "updatedAt": "2018-07-16T10:04:50.180Z",
                "__v": 0
            }
        }
    ],
    "2018-07-23": [
        {
            "_id": "5b4c6d58c9d067f47f08566d",
            "type": "task",
            "object": {
                "_id": "5b4c6d58c9d067f47f08566d",
                "isDeleted": false,
                "householdId": "5b4483d3fc5523bcbc7999d0",
                "reminder": false,
                "assignee": [
                    "5b45bad19d5566e98a57b60e",
                    "5b436751d2a43e91d96a3dbc"
                ],
                "nextDate": "2018-07-16T00:00:00.000Z",
                "endDate": null,
                "taskNameId": "5b4c35c49f86bd91814980cd",
                "dueDate": "2018-07-16T00:00:00.000Z",
                "repeat": "week",
                "ownerId": "5b45bad19d5566e98a57b60e",
                "taskName": "Buy food",
                "createdAt": "2018-07-16T10:03:04.378Z",
                "updatedAt": "2018-07-16T10:03:04.378Z",
                "__v": 0
            }
        },
        {
            "_id": "5b4c6dc2c9d067f47f085673",
            "type": "task",
            "object": {
                "_id": "5b4c6dc2c9d067f47f085673",
                "isDeleted": false,
                "householdId": "5b4483d3fc5523bcbc7999d0",
                "reminder": false,
                "assignee": [
                    "5b45bad19d5566e98a57b60e",
                    "5b436751d2a43e91d96a3dbc"
                ],
                "nextDate": "2018-08-16T00:00:00.000Z",
                "endDate": "2018-08-16T00:00:00.000Z",
                "taskNameId": "5b4c35c49f86bd91814980cd",
                "dueDate": "2018-06-16T00:00:00.000Z",
                "repeat": "day",
                "ownerId": "5b45bad19d5566e98a57b60e",
                "taskName": "Buy food",
                "createdAt": "2018-07-16T10:04:50.180Z",
                "updatedAt": "2018-07-16T10:04:50.180Z",
                "__v": 0
            }
        }
    ],
  }

  * @apiSuccess  {Object}    tasks        List of tasks grouped by date (in format YYYY-MM-DD)
  * @apiSuccess  {Object[]}  task         Array of object with taskId and type for this day
  * @apiSuccess  {String}    task._id     Task id
  * @apiSuccess  {String}    task.type    Type can be 'task' or 'event'
  * @apiSuccess  {Object}    task.object  Task object
  * @apiSuccess  {String}    task.object._id            Task id
  * @apiSuccess  {String}    task.object.ownerId        Owner id
  * @apiSuccess  {String}    task.object.householdId    Household id
  * @apiSuccess  {String}    task.object.taskNameId     TaskName id
  * @apiSuccess  {String}    task.object.dueDate        Due date
  * @apiSuccess  {String}    task.object.repeat         How often this task will repeat
  * @apiSuccess  {Boolean}   task.object.reminder       Need reminders
  * @apiSuccess  {String[]}  task.object.assignee       Array of assigned users id
  * @apiSuccess  {String}    task.object.nextDate       Next date for task
  * @apiSuccess  {String}    task.object.[endDate]      Last date for task
  * @apiSuccess  {Boolean}   task.object.isDeleted      Is task deleted
  * @apiSuccess  {String}    task.object.createdAt      Task create date
  * @apiSuccess  {String}    task.object.updatedAt      Task update date

  * @apiErrorExample {json} Error-Response:
    [{param: 'startDate', message: 'Start date is required'}]

  * @apiError {Object} StartDateRequired {param: 'startDate', message: 'Start date is required'}
  * @apiError {Object} EndDateRequired {param: 'endDate', message: 'End date is required'}
  * @apiUse accessTokenError
  */

router.get('/fulltask', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const reqData = await calendarValidate.duration(req.query, req.request.user);
    const fullResponse = true;
    return calendarAction.getTasks(reqData, fullResponse);
  });
});

router.get('/event', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const reqData = await calendarValidate.duration(req.query, req.request.user);

    return calendarAction.getAllEvent(reqData, {});
  });
});

/**
  * @apiName GetFullEventsInfoForCalendar
  * @api {GET} /api/v1/calendar/fullevent Get full events info for calendar by period

  * @apiVersion 0.0.1

  * @apiGroup Calendar

  * @apiHeader {String} Authorization User bearer access token

  * @apiParam  {String} startDate   Start date of period
  * @apiParam  {String} endDate     End date of period

  * @apiExample {curl} Example usage:
  * curl -X GET \
  *   'http://localhost:3000/api/v1/calendar/fullevent?startDate=2018-07-01T08%3A27%3A17.279Z&endDate=2018-08-01T20%3A27%3A17.279Z' \
  *     -H 'authorization: Bearer xhGGqLk6e7/1PAm/Egi5Rl2PD7dYm7Xmz4D7PzaNdbZt5WCcllKDFCEG0tjs5Y4TzL0jYXVLSa2YBX9bAuMuPlRmQn5ZbVhIl2v1h20vzYjXFGRRP4mfgJhJm3iWxQ==' \

  * @apiSuccessExample {json} Success-Response:
      {
        "2018-08-11": [
            {
                "_id": "5b4dca84e99ad18ed9e8b3fe",
                "type": "event",
                "object": {
                    "_id": "5b4dca84e99ad18ed9e8b3fe",
                    "isDeleted": false,
                    "householdId": "5b44b9626b7f1a82c4ce1473",
                    "member": [
                        "5b4473ae22bd3b6f0861bc4e",
                        "5b48813ba3537d252ad8e76b"
                    ],
                    "notify": false,
                    "title": "hhh1",
                    "startDate": "2018-08-11T06:27:17.279Z",
                    "endDate": "2018-08-20T06:27:17.279Z",
                    "fullAddress": "910 N Harbor Dr, San Diego, CA 92101, USA",
                    "ownerId": "5b4da1395ce3967bc872aa4b",
                    "createdAt": "2018-07-17T10:52:52.588Z",
                    "updatedAt": "2018-07-17T10:52:52.588Z",
                    "__v": 0
                }
            }
        ],
        "2018-08-12": [
            {
                "_id": "5b4dca84e99ad18ed9e8b3fe",
                "type": "event",
                "object": {
                    "_id": "5b4dca84e99ad18ed9e8b3fe",
                    "isDeleted": false,
                    "householdId": "5b44b9626b7f1a82c4ce1473",
                    "member": [
                        "5b4473ae22bd3b6f0861bc4e",
                        "5b48813ba3537d252ad8e76b"
                    ],
                    "notify": false,
                    "title": "hhh1",
                    "startDate": "2018-08-11T06:27:17.279Z",
                    "endDate": "2018-08-20T06:27:17.279Z",
                    "fullAddress": "910 N Harbor Dr, San Diego, CA 92101, USA",
                    "ownerId": "5b4da1395ce3967bc872aa4b",
                    "createdAt": "2018-07-17T10:52:52.588Z",
                    "updatedAt": "2018-07-17T10:52:52.588Z",
                    "__v": 0
                }
            }
        ],
        "2018-08-13": [
            {
                "_id": "5b4dca84e99ad18ed9e8b3fe",
                "type": "event",
                "object": {
                    "_id": "5b4dca84e99ad18ed9e8b3fe",
                    "isDeleted": false,
                    "householdId": "5b44b9626b7f1a82c4ce1473",
                    "member": [
                        "5b4473ae22bd3b6f0861bc4e",
                        "5b48813ba3537d252ad8e76b"
                    ],
                    "notify": false,
                    "title": "hhh1",
                    "startDate": "2018-08-11T06:27:17.279Z",
                    "endDate": "2018-08-20T06:27:17.279Z",
                    "fullAddress": "910 N Harbor Dr, San Diego, CA 92101, USA",
                    "ownerId": "5b4da1395ce3967bc872aa4b",
                    "createdAt": "2018-07-17T10:52:52.588Z",
                    "updatedAt": "2018-07-17T10:52:52.588Z",
                    "__v": 0
                }
            }
        ],
        "2018-08-14": [
            {
                "_id": "5b4dca84e99ad18ed9e8b3fe",
                "type": "event",
                "object": {
                    "_id": "5b4dca84e99ad18ed9e8b3fe",
                    "isDeleted": false,
                    "householdId": "5b44b9626b7f1a82c4ce1473",
                    "member": [
                        "5b4473ae22bd3b6f0861bc4e",
                        "5b48813ba3537d252ad8e76b"
                    ],
                    "notify": false,
                    "title": "hhh1",
                    "startDate": "2018-08-11T06:27:17.279Z",
                    "endDate": "2018-08-20T06:27:17.279Z",
                    "fullAddress": "910 N Harbor Dr, San Diego, CA 92101, USA",
                    "ownerId": "5b4da1395ce3967bc872aa4b",
                    "createdAt": "2018-07-17T10:52:52.588Z",
                    "updatedAt": "2018-07-17T10:52:52.588Z",
                    "__v": 0
                }
            }
        ],
        "2018-08-15": [
            {
                "_id": "5b4dca84e99ad18ed9e8b3fe",
                "type": "event",
                "object": {
                    "_id": "5b4dca84e99ad18ed9e8b3fe",
                    "isDeleted": false,
                    "householdId": "5b44b9626b7f1a82c4ce1473",
                    "member": [
                        "5b4473ae22bd3b6f0861bc4e",
                        "5b48813ba3537d252ad8e76b"
                    ],
                    "notify": false,
                    "title": "hhh1",
                    "startDate": "2018-08-11T06:27:17.279Z",
                    "endDate": "2018-08-20T06:27:17.279Z",
                    "fullAddress": "910 N Harbor Dr, San Diego, CA 92101, USA",
                    "ownerId": "5b4da1395ce3967bc872aa4b",
                    "createdAt": "2018-07-17T10:52:52.588Z",
                    "updatedAt": "2018-07-17T10:52:52.588Z",
                    "__v": 0
                }
            }
        ],
        "2018-08-16": [
            {
                "_id": "5b4dca84e99ad18ed9e8b3fe",
                "type": "event",
                "object": {
                    "_id": "5b4dca84e99ad18ed9e8b3fe",
                    "isDeleted": false,
                    "householdId": "5b44b9626b7f1a82c4ce1473",
                    "member": [
                        "5b4473ae22bd3b6f0861bc4e",
                        "5b48813ba3537d252ad8e76b"
                    ],
                    "notify": false,
                    "title": "hhh1",
                    "startDate": "2018-08-11T06:27:17.279Z",
                    "endDate": "2018-08-20T06:27:17.279Z",
                    "fullAddress": "910 N Harbor Dr, San Diego, CA 92101, USA",
                    "ownerId": "5b4da1395ce3967bc872aa4b",
                    "createdAt": "2018-07-17T10:52:52.588Z",
                    "updatedAt": "2018-07-17T10:52:52.588Z",
                    "__v": 0
                }
            }
        ],
        "2018-08-17": [
            {
                "_id": "5b4dca84e99ad18ed9e8b3fe",
                "type": "event",
                "object": {
                    "_id": "5b4dca84e99ad18ed9e8b3fe",
                    "isDeleted": false,
                    "householdId": "5b44b9626b7f1a82c4ce1473",
                    "member": [
                        "5b4473ae22bd3b6f0861bc4e",
                        "5b48813ba3537d252ad8e76b"
                    ],
                    "notify": false,
                    "title": "hhh1",
                    "startDate": "2018-08-11T06:27:17.279Z",
                    "endDate": "2018-08-20T06:27:17.279Z",
                    "fullAddress": "910 N Harbor Dr, San Diego, CA 92101, USA",
                    "ownerId": "5b4da1395ce3967bc872aa4b",
                    "createdAt": "2018-07-17T10:52:52.588Z",
                    "updatedAt": "2018-07-17T10:52:52.588Z",
                    "__v": 0
                }
            }
        ],
        "2018-08-18": [
            {
                "_id": "5b4dca84e99ad18ed9e8b3fe",
                "type": "event",
                "object": {
                    "_id": "5b4dca84e99ad18ed9e8b3fe",
                    "isDeleted": false,
                    "householdId": "5b44b9626b7f1a82c4ce1473",
                    "member": [
                        "5b4473ae22bd3b6f0861bc4e",
                        "5b48813ba3537d252ad8e76b"
                    ],
                    "notify": false,
                    "title": "hhh1",
                    "startDate": "2018-08-11T06:27:17.279Z",
                    "endDate": "2018-08-20T06:27:17.279Z",
                    "fullAddress": "910 N Harbor Dr, San Diego, CA 92101, USA",
                    "ownerId": "5b4da1395ce3967bc872aa4b",
                    "createdAt": "2018-07-17T10:52:52.588Z",
                    "updatedAt": "2018-07-17T10:52:52.588Z",
                    "__v": 0
                }
            }
        ],
        "2018-08-19": [
            {
                "_id": "5b4dca84e99ad18ed9e8b3fe",
                "type": "event",
                "object": {
                    "_id": "5b4dca84e99ad18ed9e8b3fe",
                    "isDeleted": false,
                    "householdId": "5b44b9626b7f1a82c4ce1473",
                    "member": [
                        "5b4473ae22bd3b6f0861bc4e",
                        "5b48813ba3537d252ad8e76b"
                    ],
                    "notify": false,
                    "title": "hhh1",
                    "startDate": "2018-08-11T06:27:17.279Z",
                    "endDate": "2018-08-20T06:27:17.279Z",
                    "fullAddress": "910 N Harbor Dr, San Diego, CA 92101, USA",
                    "ownerId": "5b4da1395ce3967bc872aa4b",
                    "createdAt": "2018-07-17T10:52:52.588Z",
                    "updatedAt": "2018-07-17T10:52:52.588Z",
                    "__v": 0
                }
            }
        ],
        "2018-08-20": [
            {
                "_id": "5b4dca84e99ad18ed9e8b3fe",
                "type": "event",
                "object": {
                    "_id": "5b4dca84e99ad18ed9e8b3fe",
                    "isDeleted": false,
                    "householdId": "5b44b9626b7f1a82c4ce1473",
                    "member": [
                        "5b4473ae22bd3b6f0861bc4e",
                        "5b48813ba3537d252ad8e76b"
                    ],
                    "notify": false,
                    "title": "hhh1",
                    "startDate": "2018-08-11T06:27:17.279Z",
                    "endDate": "2018-08-20T06:27:17.279Z",
                    "fullAddress": "910 N Harbor Dr, San Diego, CA 92101, USA",
                    "ownerId": "5b4da1395ce3967bc872aa4b",
                    "createdAt": "2018-07-17T10:52:52.588Z",
                    "updatedAt": "2018-07-17T10:52:52.588Z",
                    "__v": 0
                }
            }
        ],
        "2018-12-28": [
            {
                "_id": "5b4dd4c9c5ff1c965ad4692f",
                "type": "event",
                "object": {
                    "_id": "5b4dd4c9c5ff1c965ad4692f",
                    "isDeleted": false,
                    "householdId": "5b44b9626b7f1a82c4ce1473",
                    "member": [
                        "5b4473ae22bd3b6f0861bc4e",
                        "5b48813ba3537d252ad8e76b"
                    ],
                    "notify": false,
                    "title": "second event",
                    "startDate": "2018-12-28T06:27:17.279Z",
                    "endDate": "2019-01-03T06:27:17.279Z",
                    "fullAddress": "910 N Harbor Dr, San Diego, CA 92101, USA",
                    "ownerId": "5b4da1395ce3967bc872aa4b",
                    "createdAt": "2018-07-17T11:36:41.786Z",
                    "updatedAt": "2018-07-17T11:36:41.786Z",
                    "__v": 0
                }
            }
        ],
        "2018-12-29": [
            {
                "_id": "5b4dd4c9c5ff1c965ad4692f",
                "type": "event",
                "object": {
                    "_id": "5b4dd4c9c5ff1c965ad4692f",
                    "isDeleted": false,
                    "householdId": "5b44b9626b7f1a82c4ce1473",
                    "member": [
                        "5b4473ae22bd3b6f0861bc4e",
                        "5b48813ba3537d252ad8e76b"
                    ],
                    "notify": false,
                    "title": "second event",
                    "startDate": "2018-12-28T06:27:17.279Z",
                    "endDate": "2019-01-03T06:27:17.279Z",
                    "fullAddress": "910 N Harbor Dr, San Diego, CA 92101, USA",
                    "ownerId": "5b4da1395ce3967bc872aa4b",
                    "createdAt": "2018-07-17T11:36:41.786Z",
                    "updatedAt": "2018-07-17T11:36:41.786Z",
                    "__v": 0
                }
            }
        ],
        "2018-12-30": [
            {
                "_id": "5b4dd4c9c5ff1c965ad4692f",
                "type": "event",
                "object": {
                    "_id": "5b4dd4c9c5ff1c965ad4692f",
                    "isDeleted": false,
                    "householdId": "5b44b9626b7f1a82c4ce1473",
                    "member": [
                        "5b4473ae22bd3b6f0861bc4e",
                        "5b48813ba3537d252ad8e76b"
                    ],
                    "notify": false,
                    "title": "second event",
                    "startDate": "2018-12-28T06:27:17.279Z",
                    "endDate": "2019-01-03T06:27:17.279Z",
                    "fullAddress": "910 N Harbor Dr, San Diego, CA 92101, USA",
                    "ownerId": "5b4da1395ce3967bc872aa4b",
                    "createdAt": "2018-07-17T11:36:41.786Z",
                    "updatedAt": "2018-07-17T11:36:41.786Z",
                    "__v": 0
                }
            }
        ],
        "2018-12-31": [
            {
                "_id": "5b4dd4c9c5ff1c965ad4692f",
                "type": "event",
                "object": {
                    "_id": "5b4dd4c9c5ff1c965ad4692f",
                    "isDeleted": false,
                    "householdId": "5b44b9626b7f1a82c4ce1473",
                    "member": [
                        "5b4473ae22bd3b6f0861bc4e",
                        "5b48813ba3537d252ad8e76b"
                    ],
                    "notify": false,
                    "title": "second event",
                    "startDate": "2018-12-28T06:27:17.279Z",
                    "endDate": "2019-01-03T06:27:17.279Z",
                    "fullAddress": "910 N Harbor Dr, San Diego, CA 92101, USA",
                    "ownerId": "5b4da1395ce3967bc872aa4b",
                    "createdAt": "2018-07-17T11:36:41.786Z",
                    "updatedAt": "2018-07-17T11:36:41.786Z",
                    "__v": 0
                }
            }
        ],
        "2019-01-01": [
            {
                "_id": "5b4dd4c9c5ff1c965ad4692f",
                "type": "event",
                "object": {
                    "_id": "5b4dd4c9c5ff1c965ad4692f",
                    "isDeleted": false,
                    "householdId": "5b44b9626b7f1a82c4ce1473",
                    "member": [
                        "5b4473ae22bd3b6f0861bc4e",
                        "5b48813ba3537d252ad8e76b"
                    ],
                    "notify": false,
                    "title": "second event",
                    "startDate": "2018-12-28T06:27:17.279Z",
                    "endDate": "2019-01-03T06:27:17.279Z",
                    "fullAddress": "910 N Harbor Dr, San Diego, CA 92101, USA",
                    "ownerId": "5b4da1395ce3967bc872aa4b",
                    "createdAt": "2018-07-17T11:36:41.786Z",
                    "updatedAt": "2018-07-17T11:36:41.786Z",
                    "__v": 0
                }
            }
        ],
        "2019-01-02": [
            {
                "_id": "5b4dd4c9c5ff1c965ad4692f",
                "type": "event",
                "object": {
                    "_id": "5b4dd4c9c5ff1c965ad4692f",
                    "isDeleted": false,
                    "householdId": "5b44b9626b7f1a82c4ce1473",
                    "member": [
                        "5b4473ae22bd3b6f0861bc4e",
                        "5b48813ba3537d252ad8e76b"
                    ],
                    "notify": false,
                    "title": "second event",
                    "startDate": "2018-12-28T06:27:17.279Z",
                    "endDate": "2019-01-03T06:27:17.279Z",
                    "fullAddress": "910 N Harbor Dr, San Diego, CA 92101, USA",
                    "ownerId": "5b4da1395ce3967bc872aa4b",
                    "createdAt": "2018-07-17T11:36:41.786Z",
                    "updatedAt": "2018-07-17T11:36:41.786Z",
                    "__v": 0
                }
            }
        ],
        "2019-01-03": [
            {
                "_id": "5b4dd4c9c5ff1c965ad4692f",
                "type": "event",
                "object": {
                    "_id": "5b4dd4c9c5ff1c965ad4692f",
                    "isDeleted": false,
                    "householdId": "5b44b9626b7f1a82c4ce1473",
                    "member": [
                        "5b4473ae22bd3b6f0861bc4e",
                        "5b48813ba3537d252ad8e76b"
                    ],
                    "notify": false,
                    "title": "second event",
                    "startDate": "2018-12-28T06:27:17.279Z",
                    "endDate": "2019-01-03T06:27:17.279Z",
                    "fullAddress": "910 N Harbor Dr, San Diego, CA 92101, USA",
                    "ownerId": "5b4da1395ce3967bc872aa4b",
                    "createdAt": "2018-07-17T11:36:41.786Z",
                    "updatedAt": "2018-07-17T11:36:41.786Z",
                    "__v": 0
                }
            }
        ],
        "2018-07-18": [
            {
                "_id": "5b4ddfb2d36e8f9b8576187d",
                "type": "event",
                "object": {
                    "_id": "5b4ddfb2d36e8f9b8576187d",
                    "isDeleted": false,
                    "householdId": "5b44b9626b7f1a82c4ce1473",
                    "member": [
                        "5b4473ae22bd3b6f0861bc4e",
                        "5b48813ba3537d252ad8e76b"
                    ],
                    "notify": false,
                    "title": "second event",
                    "startDate": "2018-07-18T06:27:17.279Z",
                    "endDate": "2018-07-18T06:28:18.279Z",
                    "fullAddress": "910 N Harbor Dr, San Diego, CA 92101, USA",
                    "ownerId": "5b4da1395ce3967bc872aa4b",
                    "createdAt": "2018-07-17T12:23:14.525Z",
                    "updatedAt": "2018-07-17T12:23:14.525Z",
                    "__v": 0
                }
            },
            {
                "_id": "5b4de09fd36e8f9b85761880",
                "type": "event",
                "object": {
                    "_id": "5b4de09fd36e8f9b85761880",
                    "isDeleted": false,
                    "householdId": "5b44b9626b7f1a82c4ce1473",
                    "member": [
                        "5b4473ae22bd3b6f0861bc4e",
                        "5b48813ba3537d252ad8e76b"
                    ],
                    "notify": false,
                    "title": "second event",
                    "startDate": "2018-07-18T06:27:17.279Z",
                    "endDate": "2018-07-19T06:28:18.279Z",
                    "fullAddress": "910 N Harbor Dr, San Diego, CA 92101, USA",
                    "ownerId": "5b4da1395ce3967bc872aa4b",
                    "createdAt": "2018-07-17T12:27:11.753Z",
                    "updatedAt": "2018-07-17T12:27:11.753Z",
                    "__v": 0
                }
            }
        ],
        "2018-07-19": [
            {
                "_id": "5b4de09fd36e8f9b85761880",
                "type": "event",
                "object": {
                    "_id": "5b4de09fd36e8f9b85761880",
                    "isDeleted": false,
                    "householdId": "5b44b9626b7f1a82c4ce1473",
                    "member": [
                        "5b4473ae22bd3b6f0861bc4e",
                        "5b48813ba3537d252ad8e76b"
                    ],
                    "notify": false,
                    "title": "second event",
                    "startDate": "2018-07-18T06:27:17.279Z",
                    "endDate": "2018-07-19T06:28:18.279Z",
                    "fullAddress": "910 N Harbor Dr, San Diego, CA 92101, USA",
                    "ownerId": "5b4da1395ce3967bc872aa4b",
                    "createdAt": "2018-07-17T12:27:11.753Z",
                    "updatedAt": "2018-07-17T12:27:11.753Z",
                    "__v": 0
                }
            }
        ]
    }

  * @apiSuccess  {Object}    events        List of events grouped by date (in format YYYY-MM-DD)
  * @apiSuccess  {Object[]}  event         Array of object with eventId and type for this day
  * @apiSuccess  {String}    event._id     EVent id
  * @apiSuccess  {String}    event.type    Type can be 'task' or 'event'
  * @apiSuccess  {Object}    event.object  Task object
  * @apiSuccess  {String}    event.object._id            Task id
  * @apiSuccess  {String}    event.object.ownerId        Owner id
  * @apiSuccess  {String}    event.object.householdId    Household id
  * @apiSuccess  {String}    event.object.taskNameId     TaskName id
  * @apiSuccess  {String}    event.object.dueDate        Due date
  * @apiSuccess  {String}    event.object.repeat         How often this task will repeat
  * @apiSuccess  {Boolean}   event.object.reminder       Need reminders
  * @apiSuccess  {String[]}  event.object.assignee       Array of assigned users id
  * @apiSuccess  {String}    event.object.nextDate       Next date for task
  * @apiSuccess  {String}    event.object.[endDate]      Last date for task
  * @apiSuccess  {Boolean}   event.object.isDeleted      Is task deleted
  * @apiSuccess  {String}    event.object.createdAt      Task create date
  * @apiSuccess  {String}    event.object.updatedAt      Task update date

  * @apiErrorExample {json} Error-Response:
    [{param: 'startDate', message: 'Start date is required'}]

  * @apiError {Object} StartDateRequired {param: 'startDate', message: 'Start date is required'}
  * @apiError {Object} EndDateRequired {param: 'endDate', message: 'End date is required'}
  * @apiUse accessTokenError
*/

router.get('/fullEvent', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const reqData = await calendarValidate.duration(req.query, req.request.user);

    const fullResponse = true;
    return calendarAction.getAllEvent(reqData, {}, fullResponse);
  });
});

router.get('/list', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const reqData = await calendarValidate.duration(req.query, req.request.user);

    const task = await calendarAction.getTasks(reqData);
    return calendarAction.getAllEvent(reqData, task);
  });
});


router.get('/fullList', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const reqData = await calendarValidate.duration(req.query, req.request.user);

    const fullResponse = true;
    const task = await calendarAction.getTasks(reqData, fullResponse);
    return calendarAction.getAllEvent(reqData, task, fullResponse);
  });
});