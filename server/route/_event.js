import koaRouter from 'koa-router';

import eventAction from '../action/event';
import eventValidate from '../validator/event';
import { bearerMiddleware } from '../component/passport';
import middlewareWrapper from '../component/middlewareWrapper';

export const router = koaRouter({
  prefix: '/api/v1/event',
});

router.all('/*', bearerMiddleware);

/**
  * @apiName CreateEvent
  * @api {POST} /api/v1/event/create Create a new event

  * @apiVersion 0.0.1

  * @apiGroup Event

  * @apiHeader {String} Content-Type=application/json Content-Type
  * @apiHeader {String} Authorization User bearer access token

  * @apiParam  {String}  title Name for event
  * @apiParam  {String[]}  member Array of member users id
  * @apiParam  {String}  startDate Date when event start
  * @apiParam  {String}  endDate Date when event end
  * @apiParam  {String} fullAddress Address where event will start
  * @apiParam  {Boolean} [notify] Do or not notifications

  * @apiExample {curl} Example usage:
  *   curl -X POST \
  *   http://localhost:3000/api/v1/event/create \
  *   -H 'Authorization: Bearer DC8KlxGTNCMUFQZ2OcBvct57+cxgweUwvwvSFmbQhumAr5acw5y4l93kiDMc/DkuvkH+RiigaltKdr+ytzFScE0BTYXu4tBDVcNBXHdlYMjObz9R3OVkUpBI6jFM2A==' \
  *   -H 'Content-Type: application/json' \
  *  -d '{
  *   "title": "new event",
  *   "member": ["5b4473ae22bd3b6f0861bc4e", "5b48813ba3537d252ad8e76b"],
  *   "startDate": "2018-07-17T06:27:17.279Z",
  *   "endDate": "2018-07-20T06:27:17.279Z",
  *   "fullAddress": "ChIJI5Jp0apU2YARvCRzAnZ8ies"
  *   }'

  * @apiSuccessExample {json} Success-Response:
    {
      "isDeleted": false,
      "householdId": "5b44b9626b7f1a82c4ce1473",
      "member": [
          "5b4473ae22bd3b6f0861bc4e",
          "5b48813ba3537d252ad8e76b"
      ],
      "notify": false,
      "_id": "5b4c7b4b73c6b22fc03aa654",
      "title": "new event",
      "startDate": "2018-07-17T06:27:17.279Z",
      "endDate": "2018-07-20T06:27:17.279Z",
      "fullAddress": "910 N Harbor Dr, San Diego, CA 92101, USA",
      "ownerId": "5b48813ba3537d252ad8e76b",
      "createdAt": "2018-07-16T11:02:35.365Z",
      "updatedAt": "2018-07-16T11:02:35.365Z",
        "__v": 0
    }

  * @apiErrorExample {json} Error-Response:
    [{ param: 'member', message: 'Not all members from the same household' }]

  * @apiError {Object} MemberIdInvalid { param: 'member', message: 'Not all members from the same household' }
  * @apiError {Object} StartDate { param: 'startDate', message: 'Start date already passed' }
  * @apiError {Object} StartDate { param: 'startDate', message: 'Start date can not be after the end date' }
  * @apiUse accessTokenError
*/

router.post('/create', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const event = await eventValidate.create(req.request.body, req.request.user._id);

    return eventAction.create(event);
  });
});

/**
  * @apiName UpdateEvent
  * @api {PUT} /api/v1/event/update/id Update event

  * @apiVersion 0.0.1

  * @apiGroup Event

  * @apiHeader {String} Content-Type=application/json Content-Type
  * @apiHeader {String} Authorization User bearer access token

  * @apiParam  {String}  [title] Name for event
  * @apiParam  {String[]}  [member] Array of member users id
  * @apiParam  {String}  [startDate] Date when event start
  * @apiParam  {String}  [endDate] Date when event end
  * @apiParam  {String} [fullAddress] Address where event will start
  * @apiParam  {Boolean} [notify] Do or not notifications

  * @apiExample {curl} Example usage:
  *   curl -X PUT \
  *   http://localhost:3000/api/v1/event/update/5b4c7a8d7cac002f3e7d28b0 \
  *   -H 'Authorization: Bearer DC8KlxGTNCMUFQZ2OcBvct57+cxgweUwvwvSFmbQhumAr5acw5y4l93kiDMc/DkuvkH+RiigaltKdr+ytzFScE0BTYXu4tBDVcNBXHdlYMjObz9R3OVkUpBI6jFM2A==' \
  *   -H 'Content-Type: application/json' \
  *  -d '{
  *   "title": "new event",
  *   "member": ["5b4473ae22bd3b6f0861bc4e", "5b48813ba3537d252ad8e76b"],
  *   "startDate": "2018-07-17T06:27:17.279Z",
  *   "endDate": "2018-07-20T06:27:17.279Z",
  *   "fullAddress": "ChIJI5Jp0apU2YARvCRzAnZ8ies",
  *   "notify": true,
  *   }'

  * @apiSuccessExample {json} Success-Response:
    {
      "isDeleted": false,
      "householdId": "5b44b9626b7f1a82c4ce1473",
      "member": [
          "5b4473ae22bd3b6f0861bc4e",
          "5b48813ba3537d252ad8e76b"
      ],
      "notify": true,
      "_id": "5b4c7b4b73c6b22fc03aa654",
      "title": "new event",
      "startDate": "2018-07-17T06:27:17.279Z",
      "endDate": "2018-07-20T06:27:17.279Z",
      "fullAddress": "910 N Harbor Dr, San Diego, CA 92101, USA",
      "ownerId": "5b48813ba3537d252ad8e76b",
      "createdAt": "2018-07-16T11:02:35.365Z",
      "updatedAt": "2018-07-16T11:02:35.365Z",
        "__v": 0
    }

  * @apiErrorExample {json} Error-Response:
    [{ param: 'id', message: 'Event not found' }]

  * @apiError {Object} Id { param: 'id', message: 'Event not found' }
  * @apiError {Object} UserId { param: 'user', message: 'User can not delete this event, don\'t have permission' }
  * @apiError {Object} MemberIdInvalid { param: 'member', message: 'Not all members from the same household' }
  * @apiError {Object} StartDate { param: 'startDate', message: 'Start date already passed' }
  * @apiError {Object} StartDate { param: 'startDate', message: 'Start date can not be after the end date' }
  * @apiUse accessTokenError
*/

router.put('/update/:id', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const event = await eventValidate.update(req.request.body, req.params, req.request.user._id);

    return eventAction.update(event);
  });
});

/**
  * @apiName DeleteEvent
  * @api {DELETE} /api/v1/event/delete/id Delete event

  * @apiVersion 0.0.1

  * @apiGroup Event

  * @apiHeader {String} Content-Type=application/json Content-Type
  * @apiHeader {String} Authorization User bearer access token

  * @apiExample {curl} Example usage:
  *   curl -X DELETE \
  *   http://localhost:3000/api/v1/event/delete/5b4c7a8d7cac002f3e7d28b0 \
  *   -H 'Authorization: Bearer DC8KlxGTNCMUFQZ2OcBvct57+cxgweUwvwvSFmbQhumAr5acw5y4l93kiDMc/DkuvkH+RiigaltKdr+ytzFScE0BTYXu4tBDVcNBXHdlYMjObz9R3OVkUpBI6jFM2A==' \

  * @apiSuccessExample {json} Success-Response:
    {
        "isDeleted": false,
        "householdId": "5b44b9626b7f1a82c4ce1473",
        "member": [
            "5b4473ae22bd3b6f0861bc4e",
            "5b48813ba3537d252ad8e76b"
        ],
        "notify": false,
        "_id": "5b4c7a8d7cac002f3e7d28b0",
        "title": "new event",
        "startDate": "2018-07-17T06:27:17.279Z",
        "endDate": "2018-07-20T06:27:17.279Z",
        "fullAddress": "910 N Harbor Dr, San Diego, CA 92101, USA",
        "ownerId": "5b48813ba3537d252ad8e76b",
        "createdAt": "2018-07-16T10:59:25.210Z",
        "updatedAt": "2018-07-16T10:59:25.210Z",
        "__v": 0
    }

  * @apiErrorExample {json} Error-Response:
    [{ param: 'id', message: 'Event not found' }]

  * @apiError {Object} Id { param: 'id', message: 'Event not found' }
  * @apiError {Object} UserId { param: 'user', message: 'User can not delete this event, don\'t have permission' }
  * @apiUse accessTokenError
*/

router.delete('/delete/:id', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const event = await eventValidate.delete(req.params, req.request.user._id);

    return eventAction.delete(event);
  });
});
