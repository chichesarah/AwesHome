import koaRouter from 'koa-router';

import sharedListAction from '../action/sharedList';
import sharedListValidate from '../validator/sharedList';
import { bearerMiddleware } from '../component/passport';
import middlewareWrapper from '../component/middlewareWrapper';

export const router = koaRouter({
  prefix: '/api/v1/sharedList',
});

router.all('/*', bearerMiddleware);

/**

   * @apiSuccess  {Boolean} isDeleted false
   * @apiSuccess  {String} householdId household id
   * @apiSuccess  {Array} member member
   * @apiSuccess  {String} _id Users id
   * @apiSuccess  {String} name Name
   * @apiSuccess  {String} ownerId owner id
   * @apiSuccess  {String} createdAt Date
   * @apiSuccess  {String} updatedAt Date
   * @apiSuccess  {Array} item item
   * @apiSuccess  {Number} __v Number

   * @apiName CreateNewSharedList
   * @api {POST} /api/v1/sharedList/create Create a new shared list

   * @apiVersion 0.0.1

   * @apiGroup SharedList

   * @apiHeader {String} Content-Type=application/json Content-Type
   * @apiHeader {String} Authorization User bearer access token

   * @apiParam  {String} name Name
   * @apiParam  {Array} member Member

   * @apiExample {curl} Example usage:
   *   curl -X POST \
   *   http://localhost:3000/api/v1/sharedList/create \
   *   -H 'Authorization: Bearer eBvM9gTFmDh/YtaWxUMrIPzWU+1kxNLXc+ErlQCqF6rzyYJdc/lySe2JCMQQs15E6Eyb6ARKrJeBQHYWI7g6cDO+nkMGPO46RFWmLAZ1pbGLQalOFYqcMKXy2dg03w==' \
   *   -H 'Cache-Control: no-cache' \
   *   -H 'Content-Type: application/json' \
   *   -H 'Postman-Token: 8142dcd5-daf7-4318-bb20-bf126ab73665' \
   *   -d '{"name": "third new name","member": ["5b4471521d39a96dd14a53c6", "5b4473ae22bd3b6f0861bc4e"]}'

   * @apiSuccessExample {json} Success-Response:
    {"isDeleted": false, "householdId": null,"member": ["5b4471521d39a96dd14a53c6","5b4473ae22bd3b6f0861bc4e","5b4471521d39a96dd14a53c6"],"_id": "5b459a25c422b4a74e72fe8d","name": "third new name","ownerId": "5b4471521d39a96dd14a53c6","createdAt": "2018-07-11T05:48:21.487Z","updatedAt": "2018-07-11T05:48:21.487Z","item": [],"__v": 0}

   * @apiErrorExample {json} Error-Response:
    [{param:"name",message:"Name is already exists"}]

   * @apiError {Object} NameRequired {param:"name",message:"Name is required"}
   * @apiError {Object} UserCheckHouseholdId { param: 'userId', message: 'User do not have household' }
   * @apiError {Object} MemberRequired {param:"member",message:"Member is required"}
   * @apiError {Object} CheckMember { param: 'member', message: 'Not all users have been found in your household' }
   * @apiError {Object} NameExist {param:"name",message:"Name is already exists"}
   * @apiUse accessTokenError
*/

router.post('/create', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const sharedList = await sharedListValidate.create(req.request.body, req.request.user._id);

    return sharedListAction.create(sharedList.name, req.request.user._id, sharedList.member);
  });
});

router.put('/addItem', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const sharedList = await sharedListValidate.addItem(req.request.body, req.request.user._id);

    return sharedListAction.addItem(sharedList);
  });
});
