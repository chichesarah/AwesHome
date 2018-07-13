import koaRouter from 'koa-router';

import udidAction from '../action/udid';
import udidValidate from '../validator/udid';
import { bearerMiddleware } from '../component/passport';
import middlewareWrapper from '../component/middlewareWrapper';

export const router = koaRouter({
  prefix: '/api/v1/udid',
});

router.all('/*', bearerMiddleware);

/**

   * @apiSuccess  {Boolean} isDeleted false
   * @apiSuccess  {String} _id id
   * @apiSuccess  {String} token udid/token
   * @apiSuccess  {String} userId user id
   * @apiSuccess  {String} createdAt Date
   * @apiSuccess  {String} updatedAt Date
   * @apiSuccess  {Number} __v Number

   * @apiName CreateUdid
   * @api {POST} /api/v1/udid/create Create a new udid

   * @apiVersion 0.0.1

   * @apiGroup udid

   * @apiHeader {String} Content-Type=application/json Content-Type
   * @apiHeader {String} Authorization User bearer access token

   * @apiParam  {String} token udid/token

   * @apiExample {curl} Example usage:
   *  curl -X POST \
   *  http://localhost:3000/api/v1/udid/create \
   *  -H 'Authorization: Bearer VvMjAY0EHT+v+a8WcnTESayg8PugwwEOEjo1T4p4WHocGJBgwIfze6hv2LKQJK582XByD3iCjoorAe9HpTmJy/T9c6YYuCDPvD0E6Zu+fAtJwa/tR33S8pq9FJpboQ==' \
   *  -H 'Content-Type: application/json' \
   *  -d '{
   *  "token": "EOEjo1T4p4WHocGJBgwIfze6hv2LKQJK582XByD3iCjoorAe9HpTmJy/T"
   * }'

   * @apiSuccessExample {json} Success-Response:
      {
        "isDeleted": false,
        "_id": "5b48da7f40ac0627cc84304a",
        "token": "EOEjo1T4p4WHocGJBgwIfze6hv2LKQJK582XByD3iCjoorAe9HpTmJy/T",
        "userId": "5b44d732a454cd6329f784dc",
        "createdAt": "2018-07-13T16:59:43.205Z",
        "updatedAt": "2018-07-13T16:59:43.205Z",
        "__v": 0
      }

   * @apiErrorExample {json} Error-Response:
    [{ param : 'accessToken', message : 'Access token is incorrect'}]

   * @apiUse accessTokenError
*/

router.post('/create', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const udid = await udidValidate.create(req.request.body, req.request.user._id);

    return udidAction.create(udid, req.request.user._id);
  });
});

/**

   * @apiSuccess  {Boolean} isDeleted false
   * @apiSuccess  {String} _id id
   * @apiSuccess  {String} token udid/token
   * @apiSuccess  {String} userId user id
   * @apiSuccess  {String} createdAt Date
   * @apiSuccess  {String} updatedAt Date
   * @apiSuccess  {Number} __v Number

   * @apiName DeleteUdid
   * @api {DELETE} /api/v1/udid/delete/id Delete udid

   * @apiVersion 0.0.1

   * @apiGroup udid

   * @apiHeader {String} Content-Type=application/json Content-Type
   * @apiHeader {String} Authorization User bearer access token

   * @apiExample {curl} Example usage:
   *  curl -X DELETE \
   *  http://localhost:3000/api/v1/udid/delete/5b48da7f40ac0627cc84304a \
   *  -H 'Authorization: Bearer VvMjAY0EHT+v+a8WcnTESayg8PugwwEOEjo1T4p4WHocGJBgwIfze6hv2LKQJK582XByD3iCjoorAe9HpTmJy/T9c6YYuCDPvD0E6Zu+fAtJwa/tR33S8pq9FJpboQ==' \
   *  -H 'Content-Type: application/json' \

   * @apiSuccessExample {json} Success-Response:
      {
        "isDeleted": false,
        "_id": "5b48da7f40ac0627cc84304a",
        "token": "EOEjo1T4p4WHocGJBgwIfze6hv2LKQJK582XByD3iCjoorAe9HpTmJy/T",
        "userId": "5b44d732a454cd6329f784dc",
        "createdAt": "2018-07-13T16:59:43.205Z",
        "updatedAt": "2018-07-13T16:59:43.205Z",
        "__v": 0
      }

   * @apiErrorExample {json} Error-Response:
    [{ param : 'accessToken', message : 'Access token is incorrect'}]

   * @apiUse accessTokenError
*/

router.delete('/delete/:id', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const udid = await udidValidate.delete(req.params, req.request.user._id);

    return udidAction.delete(udid);
  });
});
