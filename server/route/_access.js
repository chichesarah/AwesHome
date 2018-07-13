import { accessAction }  from "../action/access";
import { accessValidate }  from "../validator/access";
import {bearerMiddleware,passport} from '../component/passport';
import middlewareWrapper from '../component/middlewareWrapper';
import config from '../config';

import koaRouter from 'koa-router';
import q  from 'q';

export let routerSoc = koaRouter({
  prefix: '/auth'
});

  /**
   * @apiDefine userObject
   * @apiSuccess  {String} _id Users id
   * @apiSuccess  {String} email Email
   * @apiSuccess  {String} [avatar] avatar
   * @apiSuccess  {String} lastName Last name
   * @apiSuccess  {String} firstName First name
   * @apiSuccess  {String[]} roles User access roles
   * @apiSuccess  {String} householdId Household id
   * @apiSuccess  {Boolean} isRegisterAnswers Is user answer to the registration questions
   * @apiSuccess  {Boolean} isDeleted Is user deleted
   * @apiSuccess  {Boolean} notification Enable/disable notification
   * @apiSuccess  {String} birthday Birthday
   * @apiSuccess  {String} createdAt User create date
   * @apiSuccess  {String} updatedAt User update date
   * @apiSuccess  {Object} [identities] Social networks of the user
   * @apiSuccess  {String} [identities.facebookId] User facebook id
   * @apiSuccess  {String} accessToken User access token
   * @apiSuccess  {String} [refreshToken] User refresh token
  */

  /**

   * @apiName facebookWebAuth
   * @api {GET} /auth/facebookWebAuth Web login redirect

   * @apiDescription No xhr request

   * @apiVersion 0.0.1

   * @apiGroup Facebook


   * @apiExample {curl} Example usage:
   *     curl 'http://localhost:3000/auth/facebookWebAuth'
   *      -X GET

   */

routerSoc.get('/facebookWebAuth', async(req, next) => {
  await passport.authenticate('facebook',{
      failureRedirect: '/',
      callbackURL: config.facebook.callbackURL,
      scope:['email']
    })(req,null, (err,user)=>{
      next();
    });
})

  /**

   * @apiName facebookUserWebReg
   * @api {GET} /auth/facebookUserWeb Web registration redirect for user

   * @apiDescription No xhr request

   * @apiVersion 0.0.1

   * @apiGroup Facebook


   * @apiExample {curl} Example usage:
   *     curl 'http://localhost:3000/auth/facebookUserWeb'
   *      -X GET

   */

routerSoc.get('/facebookUserWeb', async(req, next) => {
  await passport.authenticate('facebook',{
      failureRedirect: '/',
      callbackURL: config.facebook.callbackUserURL,
      scope:['email']
    })(req,null, (err,user)=>{
      next();
    });
})

let webRegCallback = async (req, next, roles, soc, url) => {
  let deferred = q.defer();


  passport.authenticate(soc, {
      successRedirect: '/',
      failureRedirect: '/login',
      callbackURL: url,
  },async (err,data)=>{

    if (err) {
      return deferred.reject(err);
    }

    data.roles = roles;
    try {
      let user = await accessAction.socReg(data);
      deferred.resolve(user);
    }
    catch (err) {
      return deferred.reject(err);
    }
  })(req,()=>{});

  try {
    let user = await deferred.promise;
    req.cookies.set('_user', encodeURIComponent(JSON.stringify(user)), {
      httpOnly:false,
      overwrite: true
    });

    req.redirect('/#Facebook')
  }
  catch (err) {
    console.log(err)
    req.redirect('/#Facebook')
  }

}

let webAuthCallback = async (req, next, soc, url) => {
  let deferred = q.defer();

  passport.authenticate(soc, {
      successRedirect: '/',
      failureRedirect: '/login',
      callbackURL: url,
  },async (err,data)=>{

    if (err) {
      return deferred.reject(err);
    }

    try {
      let user = await accessAction.socAuth(data);
      deferred.resolve(user);
    }
    catch (err) {
      return deferred.reject(err);
    }
  })(req,()=>{});

  try {
    let user = await deferred.promise;
    req.cookies.set('_user', encodeURIComponent(JSON.stringify(user)), {
      httpOnly:false,
      overwrite: true
    });

    req.redirect('/#' + soc)
  }
  catch (err) {
    console.log(err)
    req.redirect('/#' + soc)
  }

};

/**

   * @apiName facebookUserWebRegCallback
   * @api {GET} /auth/facebookUserWeb/callback Web registration callback for user

   * @apiDescription Redirect to "/". If success, then in cookies will be user object in "_user" field, in json stringify format


   * @apiParam  {String[]} email Email list. 0 item is the main
   * @apiParam  {Object[]} _json User data
   * @apiParam  {Object} _json.picture Picture object
   * @apiParam  {Object} _json.picture.data Picture data
   * @apiParam  {Object} _json.picture.data.url Avatar url
   * @apiParam  {Object} _json.name User name
   * @apiParam  {Object} _json.first_name User first name
   * @apiParam  {Object} _json.last_name User last name
   * @apiParam  {Object} _json.gender User gender
   * @apiParam  {Object} id User facebook id

   * @apiVersion 0.0.1

   * @apiGroup Facebook

   * @apiExample {curl} Example usage:
   *     curl 'http://localhost:3000/auth/facebookUserWeb/callback'
   *      -X GET
   *      -d  '{"id":"13", "email":"asd@awds.asd","_json":{"name":"asd","first_name":"asd","last_name":"asd","gender":"male", "picture":{"data":{"url":"https://scontent.xx.fbcdn.net/v/t1.0-1/c44.44.544.544/s50x50/316295_10151906553973056_2129080216_n.jpg?oh=ef0d885653512eb85c7863adc8e3299a&oe=597651A4"}}}}'

   */

routerSoc.get('/facebookUserWeb/callback', async (req, next) => {
  await webRegCallback(req, next, ['user'], 'facebook', config.facebook.callbackUserURL);
});

/**

   * @apiName facebookWebAuthCallback
   * @api {GET} /auth/facebookWeb/callback Web login callback


   * @apiDescription Redirect to "/". If success, then in cookies will be user object in "_user" field, in json stringify format

   * @apiParam  {String[]} email Email list. 0 item is the main
   * @apiParam  {Object[]} _json User data
   * @apiParam  {Object} _json.picture Picture object
   * @apiParam  {Object} _json.picture.data Picture data
   * @apiParam  {Object} _json.picture.data.url Avatar url
   * @apiParam  {Object} _json.name User name
   * @apiParam  {Object} _json.first_name User first name
   * @apiParam  {Object} _json.last_name User last name
   * @apiParam  {Object} _json.gender User gender
   * @apiParam  {Object} id User facebook id

   * @apiVersion 0.0.1

   * @apiGroup Facebook


   * @apiExample {curl} Example usage:
   *     curl 'http://localhost:3000/auth/facebookWeb/callback'
   *      -X GET
   *      -d  '{"id":"13", "email":"asd@awds.asd","_json":{"name":"asd","first_name":"asd","last_name":"asd","gender":"male", "picture":{"data":{"url":"https://scontent.xx.fbcdn.net/v/t1.0-1/c44.44.544.544/s50x50/316295_10151906553973056_2129080216_n.jpg?oh=ef0d885653512eb85c7863adc8e3299a&oe=597651A4"}}}}'

   */

routerSoc.get('/facebookWeb/callback', async (req, next) => {
  await webAuthCallback(req, next, 'facebook', config.facebook.callbackURL);
});

export const router = koaRouter({
  prefix: '/api/v1/access',
});

  /**

   * @apiName RegisterUser
   * @api {POST} /api/v1/access/register Registration

   * @apiVersion 0.0.1

   * @apiGroup Access

   * @apiHeader {String} Content-Type=application/json Content-Type

   * @apiParam  {String} email Email
   * @apiParam  {String{5,20}} password Password
   * @apiParam  {String} firstName First name
   * @apiParam  {String} lastName Last name


   * @apiExample {curl} Example usage:
   *     curl 'http://localhost:3000/api/v1/access/register'
   *      -H "Content-Type: application/json"
   *      -X POST
   *      -d  '{"email": "emaiff@test.com","password": "egtrtsdfjmch4cjyx","firstName": "First name","lastName": "Last name"}'

   * @apiSuccessExample {json} Success-Response:
   {
    "accessToken": "Exiv8Z8QYTdocoq52Lzso+osnFNcVw9+BESdb3gzJcsFhYn9orgP0420hnZOpFhVPPJOFAPLGnpWkN//mGgM2jN5Cww8nZA2tHpY8RrMdEGjopmOeHaQpI7AK1U/fA==",
    "refreshToken": "HF2kSueVdb4hN9tMUz7RfGPX3BmLdbcZMCR8yb9TjJ4WRs2SwNcSHyLnS6FjeT3zHDutCnw5CiXWg4ppdjQ9Z7gAyrrVAreUxkUFVD8VjsAmRWMD7NXoRCExHr6pXBM54z4WaZqfLhmLemvPZbBQcG74kL3WvKNnKT7cRAnxMmGj8qsSMEBWx77hCLng7WxTeMZXa8ZkRtmRcGvj5vwihHttGkFnHkPNZbzFJbhum42WgMFWwbvrYBjrbosEojV4",
    "createdAt": "2018-07-09T13:46:57.297Z",
    "updatedAt": "2018-07-09T13:46:57.297Z",
    "isDeleted": false,
    "roles": [
        "user"
    ],
    "_id": "5b436751d2a43e91d96a3dbc",
    "email": "emaiff@test.com",
    "identities": {
        "facebookId": null
    },
    "firstName": "First name",
    "lastName": "Last name"
   }

   * @apiUse userObject

   * @apiErrorExample {json} Error-Response:
      [{param: 'email', message: 'Valid email is required'}]

   * @apiError {Object} InvalidEmail {param: 'email', message: 'Valid email is required'}
   * @apiError {Object} EmailExist {param: 'email', message: 'There is an existing user connected to this email'}
   * @apiError {Object} PasswordSize {param: 'password', message: 'Password must be between 5-20 characters long'}
   * @apiError {Object} FirstNameRequired {param: 'firstName', message: 'First Name is required'}
   * @apiError {Object} LastNameRequired {param: 'lastName', message: 'Last Name is required'}
   */

router.post('/register', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const regData = await accessValidate.register(req.request.body);
    return accessAction.register(regData);
  });
});

/**

   * @apiName forgotPassword
   * @api {POST} /api/v1/access/forgot Forgot password

   * @apiVersion 0.0.1

   * @apiGroup Access

   * @apiHeader {String} Content-Type=application/json Content-Type

   * @apiParam  {String} email Email


   * @apiExample {curl} Example usage:
   *     curl 'http://localhost:3000/api/v1/access/forgot'
   *      -H "Content-Type: application/json"
   *      -X POST
   *      -d  '{"email":"vasya@ya.com"}'

   * @apiSuccessExample {json} Success-Response:
   {"result":"success"}

   * @apiSuccess  {String='success'} result Result type

   * @apiErrorExample {json} Error-Response:
      [{param: 'email', message: 'Valid email is required'}]

   * @apiError {Object} InvalidEmail {param: 'email', message: 'Valid email is required'}
   * @apiError {Object} UserNotFound {param: 'email', message: 'User not found'}

   */


router.post('/forgot', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const regData = await accessValidate.forgot(req.request.body);
    return accessAction.forgot(regData);
  });
});


/**

   * @apiName LoginUser
   * @api {POST} /api/v1/access/login Login

   * @apiVersion 0.0.1

   * @apiGroup Access

   * @apiHeader {String} Content-Type=application/json Content-Type

   * @apiParam  {String} email Email
   * @apiParam  {String} password Password


   * @apiExample {curl} Example usage:
   *     curl 'http://localhost:3000/api/v1/access/login'
   *      -H "Content-Type: application/json"
   *      -X POST
   *      -d  '{"email": "emaiff@test.com","password": "egtrtsdfjmch4cjyx"}'

   * @apiSuccessExample {json} Success-Response:
   {
    "accessToken": "tEdZaoNn0665l+J3ImuslMRy7bcxoAUgJSXGbO63c2YACflnKN8AGTSy2Cls09GNkFrPOgbtPpVb0PIBaKC822TV44FUfRwF5iuvqsm+hXnaFCyvJOdSwjs43sbtSg==",
    "refreshToken": "yCcvENJYAtvaAMTbyXSdmLLCYhyah4mrEqwtLWnqCMT7bacjxUGgrycusx3p35ar4RwajfT77F39wpwNUUJbxUxctfUCeuBGae73XPgdtpdD4eaeBTFUKKbaPvjs6hqxdyUAgVFzK2Moum36gRYmZDk2zsJNH6FctCbbVZudBHN2TcHsQi96bnGhaxEm4pPpPNqPpyQSu72NffFvNbaGsMzaj7p7kNekc7PTpZoPuaqUUZKTdbuQ52D7fsrQAb35",
    "createdAt": "2018-07-09T13:46:57.297Z",
    "updatedAt": "2018-07-09T13:46:57.297Z",
    "isDeleted": false,
    "roles": [
        "user"
    ],
    "_id": "5b436751d2a43e91d96a3dbc",
    "email": "emaiff@test.com",
    "identities": {
        "facebookId": null
    },
    "firstName": "First name",
    "lastName": "Last name"
   }

   * @apiUse userObject

   * @apiErrorExample {json} Error-Response:
      [{param: 'email', message: 'Valid email is required'}]

   * @apiError {Object} InvalidEmail {param: 'email', message: 'Valid email is required'}
   * @apiError {Object} InvalidPassword {param: 'password', message: 'Valid password is required'}
   * @apiError {Object} UserNotFound {param: 'email', message: 'User not found'}
   * @apiError {Object} PasswordIsNotCorrect {param: 'password', message: 'User password is not correct'}
   */

router.post('/login', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const regData = await accessValidate.login(req.request.body);
    return accessAction.login(regData);
  });
});

/**

   * @apiName Facebook
   * @api {POST} /api/v1/access/facebook Facebook Login/SignUp

   * @apiVersion 0.0.1

   * @apiGroup Access

   * @apiHeader {String} Content-Type=application/json Content-Type

   * @apiParam  {String} token Facebook user token

   * @apiExample {curl} Example usage:
   * curl -X POST /api/v1/access/facebook \
   *  -H 'content-type: application/json' \
   *    -d '{"token": "EAAC6ZAnan09YBADMZA502Xhpu0abBD76iwwU4hU8DSZANuqJxIClel1YAfohTEbm898MVmJg0xzl6kr6jonJClcdBllUpLtejXXDodSGysUWfDCSkiPS3aIiC6nSMOGkvJIMtbxsyJ5ZCMMkloNlpFctW86qCuB3ajArRdA6RQNMp6LORK2kOPlh6Ck6YfRExVbZCHSeqlAkQsRDFnzu9LySPBZAqknD5WdlZBVUJfFuwZDZD"}'

   * @apiSuccessExample {json} Success-Response:
   {
    "accessToken": "9mggZDLBCXgcbLhpTtJSYxeJEqTtw7Bx+lLZOPVwrbZnJLb1VcH5KF1tlFvz8D5ptkPI7PTkgjTpbzns6AU8FqyuymqAad72qLkdsOnNN3CwXIU0bav8VkQ1/8limg==",
    "refreshToken": "VJU2TWJ9XufTdCkX5k48db2Wa2jhfQ9tWactPztXYWfdBCdL5EDPBVm4MtQxJQgGXSsJpqeN7uPY9uiVs2E7FR6USSdRA8qtvqAs23rNY2YcPf2ixS2PFYn8MwdpfsBQypLnWSwPUdnZChhzaNMappBcFz3mtzcCysuS5qjuunfXcXnDHQTfoLaPYeXZTC9hz2Q5DNzxTpeWrWWRnjsu53UDoKgtct5FARHoMacq46zThcMd6HwjmCWtP3XSwmMS",
    "createdAt": "2018-07-13T10:21:45.215Z",
    "updatedAt": "2018-07-13T10:21:45.215Z",
    "isDeleted": false,
    "roles": [
        "user"
    ],
    "_id": "5b487d3927fff57c4f37b55e",
    "email": null,
    "identities": {
        "facebookId": "1034409490059581"
    },
    "avatar": "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1034409490059581&height=50&width=50&ext=1531736505&hash=AeS_j8Xp9mx24f9h",
    "firstName": "Yanislav",
    "lastName": "Konaschuk",
    "isRegisterAnswers": false,
    "householdId": null,
    "notification": true,
    "birthday": null
   }

   * @apiUse userObject

   * @apiErrorExample {json} Error-Response:
      [{param: 'token', message: 'Token is required'}]

   * @apiError {Object} TokenRequired {param: 'token', message: 'Token is required'}
   * @apiError {Object} InvalidToken {param: 'token', message: 'Invalid token'}
   */


router.post('/facebook', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const regData = await accessValidate.facebook(req.request.body);
    return accessAction.facebook(regData);
  });
});

/**

   * @apiName refreshToken
   * @api {POST} /api/v1/access/refreshToken Refresh access token

   * @apiVersion 0.0.1

   * @apiGroup Access

   * @apiHeader {String} Content-Type=application/json Content-Type

   * @apiParam  {String} refreshToken User refresh token


   * @apiExample {curl} Example usage:
   *     curl 'http://localhost:3000/api/v1/access/refreshToken'
   *      -H "Content-Type: application/json"
   *      -X POST
   *      -d  '{"refreshToken": "hy9Y7MC3qq8uUqFKpbaLvRiiyiV945eAg7gs6JpnixfeyTqg92UZjKUDum9ebFcVhq2L6rfsgzjvYtTjcyo8aKgqzPpe8Maei42zBE7ggB24H8LGXa6U83kj3gaGc8jup5qFMMwfrCE58YVVLxWWrDftHefhJgigEiDYLrLS5zqFknk9ogmFcRBGN5kkoxCBKrEzJ7kcg8LhrrRaun6MjycDBM4tQ6zKeUL4TAj6GsVgtoCBUHTZfrMbJsi6jYkE"}'

   * @apiSuccessExample {json} Success-Response:
   {
    "accessToken": "yRpz4PJjt2WNsJc4tMwNvwRPPpkguGn3SHXwmyc4zhXc3zKpKq+oNuoHgz+6WMIDsQouemAHaUDMLpGd/XLbZw8dQmpwbzpe7JjkP3pIbkxN3Fo9LEZ0710xT+oJUQ==",
    "createdAt": "2018-07-09T13:46:57.297Z",
    "updatedAt": "2018-07-09T13:46:57.297Z",
    "isDeleted": false,
    "roles": [
        "user"
    ],
    "_id": "5b436751d2a43e91d96a3dbc",
    "email": "emaiff@test.com",
    "identities": {
        "facebookId": null
    },
    "firstName": "First name",
    "lastName": "Last name"
   }

   * @apiUse userObject

   * @apiErrorExample {json} Error-Response:
      [{param: 'refreshToken', message: 'Valid refresh token is required'}]

   * @apiError {Object} InvalidRefreshToken {param: 'refreshToken', message: 'Valid refresh token is required'}
   * @apiError {Object} UserNotFound {param: 'refreshToken', message: 'User not found'}

   */


router.post('/refreshToken', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const regData = await accessValidate.refreshToken(req.request.body);
    return accessAction.refreshToken(regData);
  });
});

export let router2 = koaRouter({
  prefix: '/api/v1/authAccess'
});

router2.all('/*', bearerMiddleware);

/**

   * @apiName loginConfirm
   * @api {GET} /api/v1/authAccess/loginConfirm Check access token

   * @apiVersion 0.0.1

   * @apiGroup Access

   * @apiHeader {String} Content-Type=application/json Content-Type
   * @apiHeader {String} Authorization User bearer access token

   * @apiExample {curl} Example usage:
   *     curl 'http://localhost:3000/api/v1/authAccess/loginConfirm'
   *      -H "Content-Type: application/json"
   *      -H "Authorization: Bearer u5YnSW0kgUj9bTEXf2uX93IR4NgX9TrqCUR3Y5DFO5eJZgSAxLYU5zIL4PUDKdSM1vOZ3vVgzINaaWhYFpFzbuc0/wzHU6Iq6NWW9qHXy174W7rYbhDpeMi4E5uPrg=="
   *      -X GET

   * @apiSuccessExample {json} Success-Response:
   {"createdAt":"2017-05-17T08:41:41.510Z","updatedAt":"2017-05-17T08:41:41.510Z","isDeleted":false,"roles":["user"],"_id":"591c0cc5407eba1706aeb43e","email":"test2@mail.com","firstName":"testAdmin","lastName":"testAdmin","identities":{"facebookId":null}}

   * @apiUse userObject

   * @apiErrorExample {json} Error-Response:
      [{message:"User not found", param : 'accessToken'}]

   * @apiUse accessTokenError
   */


router2.get('/loginConfirm', async (req, next) => {
  await middlewareWrapper.wrape(req, null, async () => accessAction.loginConfirm(req.request.user));
});

/**

   * @apiName changePassword
   * @api {POST} /api/v1/authAccess/changePassword Change user password

   * @apiVersion 0.0.1

   * @apiGroup Access

   * @apiHeader {String} Content-Type=application/json Content-Type
   * @apiHeader {String} Authorization User bearer access token

   * @apiParam  {String} password Password
   * @apiParam  {String} oldPassword Old password


   * @apiExample {curl} Example usage:
   *     curl 'http://localhost:3000/api/v1/authAccess/changePassword'
   *      -H "Content-Type: application/json"
   *      -H "Authorization: Bearer u5YnSW0kgUj9bTEXf2uX93IR4NgX9TrqCUR3Y5DFO5eJZgSAxLYU5zIL4PUDKdSM1vOZ3vVgzINaaWhYFpFzbuc0/wzHU6Iq6NWW9qHXy174W7rYbhDpeMi4E5uPrg=="
   *      -X POST
   *      -d  '{"password":"test","oldPassword":"test"}'

   * @apiSuccessExample {json} Success-Response:
   {"result":"success"}

   * @apiSuccess  {String='success'} result Result type

   * @apiErrorExample {json} Error-Response:
      [{param : 'accessToken', message : 'User not found'}]

   * @apiError {Object} PasswordSize {param:"password",message:"Password must be between 5-20 characters long"}
   * @apiError {Object} OldPasswordSize {param:"password",message:"Old password must be between 5-20 characters long"}
   * @apiError {Object} UserNotFound {param : 'accessToken', message : 'User not found'}
   * @apiError {Object} OldPasswordIsNotCorrect {param : 'oldPassword', message : 'User old password is not correct'}
   * @apiUse accessTokenError

   */

router2.post('/changePassword', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const password = await accessValidate.changePassword(req.request.body, req.request.user);
    return accessAction.changePassword(password, req.request.user);
  });
});
