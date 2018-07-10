import { userAction }  from "../action/user";
import { userValidate }  from "../validator/user";
import {bearerMiddleware} from '../component/passport';
import middlewareWrapper from '../component/middlewareWrapper';
import config from '../config';

import koaRouter from 'koa-router';

export let router = koaRouter({
  prefix: '/api/v1/user'
});

router.all('/*', bearerMiddleware);

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
          -F 'pictureList=@\"myfile.jpg\"'

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

router.get('/members', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => userAction.getMembers(req.request.user._id));
});
