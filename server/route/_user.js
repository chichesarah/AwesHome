import koaRouter from 'koa-router';

import { userAction } from '../action/user';
import { userValidate } from '../validator/user';
import { bearerMiddleware } from '../component/passport';
import middlewareWrapper from '../component/middlewareWrapper';

export const router = koaRouter({
  prefix: '/api/v1/user',
});

router.all('/*', bearerMiddleware);


/**

  * @apiName answerQuestions
  * @api {POST} /api/v1/user/answerQuestions Answer to the registration questions

  * @apiVersion 0.0.1

  * @apiGroup user

  * @apiHeader {String} Content-Type=multipart/form-data Content-Type
  * @apiHeader {String} Authorization User bearer access token

  * @apiParam  {String} roommatesCount Roommates count
  * @apiParam  {String} placeId Google placeId
  * @apiParam  {File} [avatar] Avatar image

  * @apiExample {curl} Example usage:
  * curl -X POST \
  *    http://localhost:3000/api/v1/user/answerQuestions \
  *      -H 'authorization: Bearer aQA5Ojd35OgMvIIceRT2gJlGXYDPrq9fTaRv+UMDdMn0L25+IUzy9OW8KMc0011wqBtgxDWWZsMZ6W/tgdvmlOKSDJvmfywgSINJupJ2zLi42koukTtQkYHOsefMtQ==' \
  *      -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \
  *        -F roommatesCount=4 \
  *        -F placeId=ChIJI5Jp0apU2YARvCRzAnZ8ies \
  *        -F avatar=@b1f159fea9970ac31637176cd6014810_83937.jpg

  * @apiSuccessExample {json} Success-Response:
  {
    "createdAt": "2018-07-09T13:46:57.297Z",
    "updatedAt": "2018-07-10T10:18:04.135Z",
    "isDeleted": false,
    "roles": [
      "user"
    ],
    "_id": "5b436751d2a43e91d96a3dbc",
    "email": "emaiff@test.com",
    "firstName": "First name",
    "lastName": "Last name",
    "identities": {
      "facebookId": null
    },
    "avatar": "http://res.cloudinary.com/opengeeksvkcloudy/image/upload/v1531217887/dn0ie50rkwvgo9fen163.jpg",
    "householdId": "5b4487dc2b6816bda946a166",
    "isRegisterAnswers": true
  }

  * @apiUse userObject

  * @apiErrorExample {json} Error-Response:
    [{param: 'placeId', message: 'Valid placeId is required'}]

  * @apiError {Object} PlaceIdRequired {param: 'placeId', message: 'Valid placeId is required'}
  * @apiError {Object} RoommatesCountRequired {param: 'roommatesCount', message: 'Valid roommatesCount is required'}
  * @apiError {Object} UploadAvatarError {param: 'avatar', message: 'Upload error'}
  * @apiError {Object} StreetNumberRequired {param: 'streetNumber', message: 'Valid streetNumber is required'}
  * @apiError {Object} RouteRequired {param: 'route', message: 'Valid route is required'}
  * @apiError {Object} CityRequired {param: 'city', message: 'Valid city is required'}
  * @apiError {Object} ZipRequired {param: 'zip', message: 'Valid zip is required'}
  * @apiError {Object} StateRequired {param: 'state', message: 'Valid state is required'}
  * @apiError {Object} FullAddressRequired {param: 'fullAddress', message: 'Valid fullAddress is required'}
  * @apiError {Object} GooglePlaceIdError {param: 'placeId', message: 'Google place error'}
  * @apiError {Object} UserNotFound {param : 'email', message : 'User not found'}
  * @apiUse accessTokenError
  */

router.post('/answerQuestions', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const regData = await userValidate.registerAnswers(req.request.body, req.request.user);
    return userAction.registerAnswers(regData, req.request.user);
  });
});

/**

   * @apiName UpdateUser
   * @api {PUT} /api/v1/user/update User update

   * @apiVersion 0.0.1

   * @apiGroup user

   * @apiHeader {String} Content-Type=multipart/form-data Content-Type
   * @apiHeader {String} Authorization User bearer access token

   * @apiParam  {String} [email] Email
   * @apiParam  {String} [firstName] First name
   * @apiParam  {String} [lastName] Last name
   * @apiParam  {String} [facebookId] User facebook id
   * @apiParam  {String} [birthday] Birthday
   * @apiParam  {String} [phone] Phone number
   * @apiParam  {File} [avatar] Avatar image
   * @apiParam  {Boolean} [removeAvatar] Remove avatar

   * @apiExample {curl} Example usage:
   *     curl 'http://localhost:3000/api/v1/user/update'
   *      -H "Content-Type: application/json"
   *      -X PUT
   *      -d  '{"email":"vasya@ya.com","firstName":"Vasya","lastName":"Pupkin"}'
   *      -F 'pictureList=@\"myfile.jpg\"'

   * @apiSuccessExample {json} Success-Response:
   {"createdAt":"2017-05-17T08:41:41.510Z","updatedAt":"2017-05-19T11:39:16.970Z","isDeleted":false,"roles":["user"],"_id":"591c0cc5407eba1706aeb43e","email":"test2@mail.com","firstName":"title1","lastName":"testAdmin",identities":{"facebookId":null},"avatar":"http://res.cloudinary.com/diu5kwhe7/image/upload/v1495193958/cgato7gb0athnkai15pb.jpg"}

   * @apiUse userObject

   * @apiErrorExample {json} Error-Response:
      [{param: 'email', message: 'Valid email is required'}]

   * @apiError {Object} InvalidEmail {param: 'email', message: 'Valid email is required'}
   * @apiError {Object} FirstNameRequired {param: 'firstName', message: 'First Name is required'}
   * @apiError {Object} LastNameRequired {param: 'lastName', message: 'Last Name is required'}
   * @apiError {Object} GenderRequired {param: 'gender', message: 'Gender is required'}
   * @apiError {Object} AvatarRequired {param : 'avatar', message : 'Upload error'}
   * @apiError {Object} UserNotFound {param : 'email', message : 'User not found'}
   * @apiUse accessTokenError
   */

router.put('/update', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const reqData = await userValidate.update(req.request.body, req.request.user);
    return userAction.update(reqData);
  });
});

/**

  * @apiName GetAllMembers
  * @api {GET} /api/v1/user/membersInHousehold Get All Members
  * @apiVersion 0.0.1

  * @apiGroup user

  * @apiHeader {String} Content-Type=multipart/form-data Content-Type
  * @apiHeader {String} Authorization User bearer access token

  * @apiExample {curl} Example usage:
  *   curl -X GET \
  *   http://localhost:3000/api/v1/user/membersInHousehold \
  *   -H 'Authorization: Bearer eBvM9gTFmDh/YtaWxUMrIPzWU+1kxNLXc+ErlQCqF6rzyYJdc/lySe2JCMQQs15E6Eyb6ARKrJeBQHYWI7g6cDO+nkMGPO46RFWmLAZ1pbGLQalOFYqcMKXy2dg03w=='

  * @apiSuccessExample {json} Success-Response:
    [{"_id": "5b4473ae22bd3b6f0861bc4e","identities": {"facebookId": null},"isDeleted": false,"householdId": "5b44b9626b7f1a82c4ce1473","avatarId": null,"registerAnswers": [],"roles": ["user"],"birthday": null,"phone": null,"email": "qwerty1@gmail.com","password": "rwngu4GpfiO0JmtzRuu7ZHXvrb0gHHTR01jOkDU080Uvkcj7vo+P4MDUNMjGV4cn/LKSvqad41Orb5XWyIh8cA==","firstName": "gg","lastName": "ff","salt": "7jhQiCGwwh8cqMb0wGb7HA==","createdAt": "2018-07-10T08:51:58.164Z","updatedAt": "2018-07-11T05:01:28.510Z","__v": 0,"isRegisterAnswers": true,"roommatesCount": 2}]

  * @apiUse userObject

  * @apiErrorExample {json} Error-Response:
    [{ param : 'accessToken', message : 'Access token is incorrect'}]

  * @apiError {Object} AccessTokenIncorrect { param : 'accessToken', message : 'Access token is incorrect'}
  * @apiUse accessTokenError
*/

router.get('/membersInHousehold', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => userAction.getMembers(req.request.user._id));
});
