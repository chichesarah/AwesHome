import koaRouter from 'koa-router';

import feedAction from '../action/feed';
import { bearerMiddleware } from '../component/passport';
import middlewareWrapper from '../component/middlewareWrapper';

export const router = koaRouter({
  prefix: '/api/v1/feed',
});

router.all('/*', bearerMiddleware);

/**

   * @apiName GetAllFeedList
   * @api {GET} /api/v1/feed/all Get all feed list

   * @apiVersion 0.0.1

   * @apiGroup Feed

   * @apiSuccess  {Boolean} isDeleted false
   * @apiSuccess  {String} _id feed id
   * @apiSuccess  {String} userId User id
   * @apiSuccess  {String} householdId household id
   * @apiSuccess  {String} type type of feed
   * @apiSuccess  {Array} operation operation array
   * @apiSuccess  {String} operation.id operation id
   * @apiSuccess  {String} operation.name operation name
   * @apiSuccess  {String} operation.type operation type
   * @apiSuccess  {String} type type of feed
   * @apiSuccess  {String} createdAt Date
   * @apiSuccess  {String} updatedAt Date

   * @apiHeader  {String} Content-Type=application/json Content-Type
   * @apiHeader  {String} Authorization User bearer access token

   * @apiExample {curl} Example usage:
   *  curl -X GET
   *  http://localhost:3000/api/v1/feed/all
   *  -H 'Authorization: Bearer f2d2aztgKDYsvk74Rkv+fl7LXpvU8Q8PEXkjI2zZAX1oYIvSii/fXVXysE828uuXZ1bIuQ8+V94aWbIAiB0NO2axbZSB6t+GqtXMb1g9j2m1ACRHxEdf6G39nozwBA=='

   * @apiSuccessExample {json} Success-Response:
      [
        {
          "_id": "5b4781d0c5f812866734ab15",
          "isDeleted": false,
          "userId": "5b44d732a454cd6329f784dc",
          "householdId": "5b477730ae10e28228be1eb8",
          "type": "delete task",
          "operation": [
            {
              "id": "5b4781cac5f812866734ab12",
              "_id": "5b4781d0c5f812866734ab16",
              "name": "reandom1",
              "type": "task"
            }
          ],
          "createdAt": "2018-07-12T16:29:04.196Z",
          "user": {
            "firstName": "ff",
            "lastName": "gg"
          }
        }
      ]

   * @apiErrorExample {json} Error-Response:
    [{ param : 'accessToken', message : 'Access token is incorrect'}]

   * @apiUse accessTokenError
*/

router.get('/all', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => feedAction.getAllFeed(req.request.user._id));
});
