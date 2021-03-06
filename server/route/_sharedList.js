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
   * @apiDefine listObject
   * @apiSuccess  {Boolean} isDeleted false
   * @apiSuccess  {String} householdId household id
   * @apiSuccess  {Array} member member
   * @apiSuccess  {String} _id Users id
   * @apiSuccess  {String} name Name
   * @apiSuccess  {String} ownerId owner id
   * @apiSuccess  {String} createdAt Date
   * @apiSuccess  {String} updatedAt Date
   * @apiSuccess  {Array} item item
 */

/**

   * @apiName CreateNewSharedList
   * @api {POST} /api/v1/sharedList/create Create a new shared list

   * @apiVersion 0.0.1

   * @apiGroup SharedList

   * @apiHeader {String} Content-Type=application/json Content-Type
   * @apiHeader {String} Authorization User bearer access token

   * @apiParam  {String} name Name
   * @apiParam  {Array} member Member

   * @apiExample {curl} Example usage:
   *   curl -X POST
   *   http://localhost:3000/api/v1/sharedList/create
   *   -H 'Authorization: Bearer eBvM9gTFmDh/YtaWxUMrIPzWU+1kxNLXc+ErlQCqF6rzyYJdc/lySe2JCMQQs15E6Eyb6ARKrJeBQHYWI7g6cDO+nkMGPO46RFWmLAZ1pbGLQalOFYqcMKXy2dg03w=='
   *   -H 'Cache-Control: no-cache'
   *   -H 'Content-Type: application/json'
   *   -H 'Postman-Token: 8142dcd5-daf7-4318-bb20-bf126ab73665'
   *   -d '{"name": "third new name","member": ["5b4471521d39a96dd14a53c6", "5b4473ae22bd3b6f0861bc4e"]}'

   * @apiSuccessExample {json} Success-Response:
    {"isDeleted": false, "householdId": null,"member": ["5b4471521d39a96dd14a53c6","5b4473ae22bd3b6f0861bc4e","5b4471521d39a96dd14a53c6"],"_id": "5b459a25c422b4a74e72fe8d","name": "third new name","ownerId": "5b4471521d39a96dd14a53c6","createdAt": "2018-07-11T05:48:21.487Z","updatedAt": "2018-07-11T05:48:21.487Z","item": [],"__v": 0}

   * @apiUse listObject

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

    return sharedListAction.create(sharedList.name, req.request.user._id, sharedList.member, sharedList.householdId);
  });
});

/**

   * @apiName AddItemToSharedList
   * @api {PUT} /api/v1/sharedList/addItem Add item to shared list

   * @apiVersion 0.0.1

   * @apiGroup SharedList

   * @apiHeader {String} Content-Type=application/json Content-Type
   * @apiHeader {String} Authorization User bearer access token

   * @apiParam  {String} sharedListId Shared list id
   * @apiParam  {String} name Name
   * @apiParam  {String} memberId Member id

   * @apiExample {curl} Example usage:
   *  curl -X PUT
   *  http://localhost:3000/api/v1/sharedList/addItem
   *  -H 'Authorization: Bearer exJtREkJH4o3XmH6+Qtta5IDzTlhNUvh6MwYlKN9p+yZoEG1n9VOoMFKoAgrMh2IacR7d7ZU8s3UANcqHPvK2a79XNugckEckhxZEFZSvNVGTV6+qXptnDKsDlU12Q=='
   *  -H 'Content-Type: application/json'
   *  -d '{
   *  "sharedListId": "5b45afa621ec57b9f189fd00",
   *  "name": "first item name",
   *  "memberId": "5b4473ae22bd3b6f0861bc47"

   * @apiSuccessExample {json} Success-Response:
      {"isDeleted": false,"householdId": null, "member": ["5b4471521d39a96dd14a53c6","5b4473ae22bd3b6f0861bc4e"],"_id": "5b45afa621ec57b9f189fd00","name": "first item name 2 2 2","ownerId": "5b4473ae22bd3b6f0861bc4e","createdAt": "2018-07-11T07:20:06.493Z","updatedAt": "2018-07-11T07:20:06.493Z","item": [{"status": false,"_id": "5b45ba8218ff8bc0c8ee1e41","memberId": "5b4473ae22bd3b6f0861bc4e","name": "first item name"}],"__v": 4}

   * @apiUse listObject

   * @apiErrorExample {json} Error-Response:
    [{param:"name",message:"Name is already exists"}]

   * @apiError {Object} NameRequired {param:"name",message:"Name is required"}
   * @apiError {Object} NameExist {param:"name",message:"Name is already exists"}
   * @apiError {Object} MemberIdRequired {param:"member",message:"Member is required"}
   * @apiError {Object} SharedListIdRequired { param: 'sharedList', message: 'Shared list not found' }
   * @apiError {Object} UserId { param: 'userId', message: 'User is not a member of shareList' }
   * @apiError {Object} MemberId { param: 'memberId', message: 'User is not a member of shareList' }
   * @apiUse accessTokenError
*/

router.put('/addItem', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const sharedList = await sharedListValidate.addItem(req.request.body, req.request.user._id);

    return sharedListAction.addItem(sharedList, req.request.user._id);
  });
});

/**

   * @apiName ChangeItemStatus
   * @api {PUT} /api/v1/sharedList/checkItem Change Item Status

   * @apiVersion 0.0.1

   * @apiGroup SharedList

   * @apiHeader  {String} Content-Type=application/json Content-Type
   * @apiHeader  {String} Authorization User bearer access token

   * @apiParam  {String} sharedListId Shared list id
   * @apiParam  {String} itemId Item id
   * @apiParam  {Boolean} status Status

   * @apiExample {curl} Example usage:
   *  curl -X PUT
   *  http://localhost:3000/api/v1/sharedList/checkItem
   *  -H 'Authorization: Bearer exJtREkJH4o3XmH6+Qtta5IDzTlhNUvh6MwYlKN9p+yZoEG1n9VOoMFKoAgrMh2IacR7d7ZU8s3UANcqHPvK2a79XNugckEckhxZEFZSvNVGTV6+qXptnDKsDlU12Q=='
   *  -H 'Content-Type: application/json'
   *  -d '{
   *  "sharedListId": "5b45afa621ec57b9f189fd00",
   *  "itemId": "5b45dc3a32c623d06dc24fb8",
   *  "status": true,
   *  }'

   * @apiSuccessExample {json} Success-Response:
    {"isDeleted": false,"householdId": null,"member": ["5b4471521d39a96dd14a53c6",],"_id": "5b45afa621ec57b9f189fd00","name": "first item name 2 2 2","ownerId": "5b4473ae22bd3b6f0861bc4e","createdAt": "2018-07-11T07:20:06.493Z","updatedAt": "2018-07-11T07:20:06.493Z","item": [{"status": true,"_id": "5b45dc3a32c623d06dc24fb8","name": "first item name 2 2 3","memberId": "5b4473ae22bd3b6f0861bc4e"}],"__v": 9}

   * @apiUse listObject

   * @apiErrorExample {json} Error-Response:
    [{param:"name",message:"Name is already exists"}]

   * @apiError {Object} SharedListIdRequired { param: 'sharedList', message: 'Shared list not found' }
   * @apiError {Object} UserId { param: 'userId', message: 'User is not a member of shareList' }
   * @apiError {Object} MemberId { param: 'memberId', message: 'User is not a member of shareList' }
   * @apiError {Object} ItemId { param: 'itemId', message: 'Item im shared list not found' }
   * @apiError {Object} Status { param: 'status', message: 'Status is incorrect' }
   * @apiUse accessTokenError
*/

router.put('/checkItem', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const sharedList = await sharedListValidate.checkItem(req.request.body, req.request.user._id);

    return sharedListAction.checkItem(sharedList, req.request.user._id);
  });
});

/**

   * @apiName DeleteSharedList
   * @api {DELETE} /api/v1/sharedList/id Delete shared list

   * @apiVersion 0.0.1

   * @apiGroup SharedList

   * @apiHeader  {String} Content-Type=application/json Content-Type
   * @apiHeader  {String} Authorization User bearer access token

   * @apiExample {curl} Example usage:
   *  curl -X DELETE
   *  http://localhost:3000/api/v1/sharedList/5b45afa621ec57b9f189fd00
   *  -H 'Authorization: Bearer exJtREkJH4o3XmH6+Qtta5IDzTlhNUvh6MwYlKN9p+yZoEG1n9VOoMFKoAgrMh2IacR7d7ZU8s3UANcqHPvK2a79XNugckEckhxZEFZSvNVGTV6+qXptnDKsDlU12Q=='

   * @apiSuccessExample {json} Success-Response:
    {"isDeleted": false,"householdId": null,"member": ["5b4471521d39a96dd14a53c6","5b4473ae22bd3b6f0861bc4e"],"_id": "5b45afa621ec57b9f189fd00","name": "first item name 2 2 2","ownerId": "5b4473ae22bd3b6f0861bc4e","createdAt": "2018-07-11T07:20:06.493Z","updatedAt": "2018-07-11T07:20:06.493Z","item": [],"__v": 14}

   * @apiUse listObject

   * @apiErrorExample {json} Error-Response:
    [{param:"name",message:"Name is already exists"}]

   * @apiError {Object} SharedListIdRequired { param: 'sharedList', message: 'Shared list not found' }
   * @apiError {Object} UserId { param: 'userId', message: 'User is not a member of shareList' }
   * @apiUse accessTokenError
*/

router.delete('/:id', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const sharedList = await sharedListValidate.deleteSharedList(req.params, req.request.user._id);

    return sharedListAction.deleteSharedList(sharedList._id, req.request.user._id);
  });
});

/**

   * @apiName GetAllSharedList
   * @api {GET} /api/v1/sharedList/all Get all shared list

   * @apiVersion 0.0.1

   * @apiGroup SharedList

   * @apiHeader  {String} Content-Type=application/json Content-Type
   * @apiHeader  {String} Authorization User bearer access token

   * @apiExample {curl} Example usage:
   *  curl -X GET
   *  http://localhost:3000/api/v1/sharedList/all
   *  -H 'Authorization: Bearer exJtREkJH4o3XmH6+Qtta5IDzTlhNUvh6MwYlKN9p+yZoEG1n9VOoMFKoAgrMh2IacR7d7ZU8s3UANcqHPvK2a79XNugckEckhxZEFZSvNVGTV6+qXptnDKsDlU12Q=='

   * @apiSuccessExample {json} Success-Response:
      [{"_id": "5b459a25c422b4a74e72fe8d","isDeleted": false,"householdId": null,"member": ["5b4471521d39a96dd14a53c6","5b4473ae22bd3b6f0861bc4e","5b4471521d39a96dd14a53c6"],"name": "third new name","ownerId": "5b4471521d39a96dd14a53c6","createdAt": "2018-07-11T05:48:21.487Z","updatedAt": "2018-07-11T05:48:21.487Z","item": [],"__v": 0},]

   * @apiUse listObject

   * @apiErrorExample {json} Error-Response:
    [{ param : 'accessToken', message : 'Access token is incorrect'}]

   * @apiUse accessTokenError
*/

router.get('/all', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => sharedListAction.getAllSharedList(req.request.user._id));
});
