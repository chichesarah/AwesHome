import koaRouter from 'koa-router';

import { householdAction } from '../action/household';
import { userValidate } from '../validator/user';
import { householdValidate } from '../validator/household';
import { bearerMiddleware } from '../component/passport';
import middlewareWrapper from '../component/middlewareWrapper';

export const router = koaRouter({
  prefix: '/api/v1/household',
});

router.all('/*', bearerMiddleware);

/**
 * @apiDefine householdObject
 * @apiSuccess  {String} _id Household id
 * @apiSuccess  {String} addressLine Household address
 * @apiSuccess  {String} city Household city
 * @apiSuccess  {String} zip Household zip
 * @apiSuccess  {String} state Household state
 * @apiSuccess  {String} fullAddress Household fullAddress
 * @apiSuccess  {Boolean} isDeleted Is user deleted
 * @apiSuccess  {String} createdAt User create date
 * @apiSuccess  {String} updatedAt User update date
*/

/**
  * @apiName CreateHousehold
  * @api {POST} /api/v1/household/create Create

  * @apiVersion 0.0.1

  * @apiGroup Household

  * @apiHeader {String} Content-Type=application/json Content-Type
  * @apiHeader {String} Authorization User bearer access token

  * @apiExample {curl} Example usage:
  * curl -X POST /api/v1/household/create \
  *     -H 'authorization: Bearer HFWlsKleEJ3BV2IEpghcs8m+Kk5jx/i82VdF5UEfqG6b712dnpC3eFqP1ghTjwjd+wdDGlDHr2dBBErf8lLFgA93mS4nkNhzlha7P4DOl8QQVBkRNvx94HLtXByrNg==' \
  *     -H 'content-type: application/json' \

  * @apiSuccessExample {json} Success-Response:
  {
    "createdAt": "2018-07-11T08:07:45.104Z",
    "updatedAt": "2018-07-18T07:20:31.911Z",
    "isDeleted": false,
    "roles": [
        "user"
    ],
    "_id": "5b45bad19d5566e98a57b60e",
    "email": "emai2@test.com",
    "firstName": "First2",
    "lastName": "Last2",
    "identities": {
        "facebookId": null
    },
    "avatar": "http://res.cloudinary.com/opengeeksvkcloudy/image/upload/v1531898433/uau7einhltxh60v9b8lh.jpg",
    "householdId": "5b4f0797249e6a4d19a8b7aa",
    "isRegisterAnswers": true,
    "notification": true,
    "birthday": null,
    "neighbourhood": "Arden Heights"
  }

  * @apiUse userObject

  * @apiErrorExample {json} Error-Response:
    [{param: 'userId', message: 'User not found'}]

  * @apiError {Object} UserNotFound {param: 'userId', message: 'User not found'}
  * @apiError {Object} UserInHousehold {param: 'userId', message: 'User already in the household'}
  * @apiUse accessTokenError
  */


router.post('/create', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const reqData = await userValidate.checkUser(req.request.user._id);
    return householdAction.create(reqData);
  });
});

/**
  * @apiName ConnectToHousehold
  * @api {PUT} /api/v1/household/connect/{_id} Connect to household

  * @apiVersion 0.0.1

  * @apiGroup Household

  * @apiHeader {String} Content-Type=application/json Content-Type
  * @apiHeader {String} Authorization User bearer access token

  * @apiParam  {String}  _id Household id

  * @apiExample {curl} Example usage:
  * curl -X PUT /api/v1/household/connect/5b4ef3b60622f2430bed6f0b \
  *     -H 'authorization: Bearer HFWlsKleEJ3BV2IEpghcs8m+Kk5jx/i82VdF5UEfqG6b712dnpC3eFqP1ghTjwjd+wdDGlDHr2dBBErf8lLFgA93mS4nkNhzlha7P4DOl8QQVBkRNvx94HLtXByrNg==' \
  *     -H 'content-type: application/json' \

  * @apiSuccessExample {json} Success-Response:
  {
    "createdAt": "2018-07-11T08:07:45.104Z",
    "updatedAt": "2018-07-18T07:20:31.911Z",
    "isDeleted": false,
    "roles": [
        "user"
    ],
    "_id": "5b45bad19d5566e98a57b60e",
    "email": "emai2@test.com",
    "firstName": "First2",
    "lastName": "Last2",
    "identities": {
        "facebookId": null
    },
    "avatar": "http://res.cloudinary.com/opengeeksvkcloudy/image/upload/v1531898433/uau7einhltxh60v9b8lh.jpg",
    "householdId": "5b4f0797249e6a4d19a8b7aa",
    "isRegisterAnswers": true,
    "notification": true,
    "birthday": null,
    "neighbourhood": "Arden Heights"
  }

  * @apiUse userObject

  * @apiErrorExample {json} Error-Response:
    [{param: 'userId', message: 'User not found'}]

  * @apiError {Object} UserNotFound {param: 'userId', message: 'User not found'}
  * @apiError {Object} InvalidHouseholdId {param: 'householdId', message: 'Invalid household id'}
  * @apiError {Object} HouseholdNotFound {param: 'householdId', message: 'Household not found'}
  * @apiError {Object} CantConnectToHousehold {param: 'householdId', message: 'Before join the household you must leave the current one.'}
  * @apiUse accessTokenError
  */

router.put('/connect/:_id', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const reqData = await householdValidate.connect(req.params, req.request.user);
    return householdAction.connect(reqData);
  });
});

/**
  * @apiName LeaveHousehold
  * @api {PUT} /api/v1/household/leave Leave

  * @apiVersion 0.0.1

  * @apiGroup Household

  * @apiHeader {String} Content-Type=application/json Content-Type
  * @apiHeader {String} Authorization User bearer access token

  * @apiExample {curl} Example usage:
  * curl -X PUT /api/v1/household/leave \
  *     -H 'authorization: Bearer HFWlsKleEJ3BV2IEpghcs8m+Kk5jx/i82VdF5UEfqG6b712dnpC3eFqP1ghTjwjd+wdDGlDHr2dBBErf8lLFgA93mS4nkNhzlha7P4DOl8QQVBkRNvx94HLtXByrNg==' \
  *     -H 'content-type: application/json' \

  * @apiSuccessExample {json} Success-Response:
  {
    "createdAt": "2018-07-11T08:07:45.104Z",
    "updatedAt": "2018-07-18T07:20:31.911Z",
    "isDeleted": false,
    "roles": [
        "user"
    ],
    "_id": "5b45bad19d5566e98a57b60e",
    "email": "emai2@test.com",
    "firstName": "First2",
    "lastName": "Last2",
    "identities": {
        "facebookId": null
    },
    "avatar": "http://res.cloudinary.com/opengeeksvkcloudy/image/upload/v1531898433/uau7einhltxh60v9b8lh.jpg",
    "householdId": null,
    "isRegisterAnswers": true,
    "notification": true,
    "birthday": null,
    "neighbourhood": "Arden Heights"
  }

  * @apiUse userObject

  * @apiErrorExample {json} Error-Response:
    [{param: 'userId', message: 'User not found'}]

  * @apiError {Object} UserNotFound {param: 'userId', message: 'User not found'}
  * @apiError {Object} CantLeaveHousehold {param: 'accessToken', message: 'User is not connected to the household'}
  * @apiUse accessTokenError
  */

router.put('/leave', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const reqData = await householdValidate.leave(req.request.user);
    return householdAction.leave(reqData);
  });
});

/**
  * @apiName GetById
  * @api {GET} /api/v1/household/my Get household by id

  * @apiVersion 0.0.1

  * @apiGroup Household

  * @apiHeader {String} Content-Type=application/json Content-Type
  * @apiHeader {String} Authorization User bearer access token

  * @apiParam  {String}  _id Household id

  * @apiExample {curl} Example usage:
  * curl -X GET /api/v1/household/my \
  *     -H 'authorization: Bearer HFWlsKleEJ3BV2IEpghcs8m+Kk5jx/i82VdF5UEfqG6b712dnpC3eFqP1ghTjwjd+wdDGlDHr2dBBErf8lLFgA93mS4nkNhzlha7P4DOl8QQVBkRNvx94HLtXByrNg==' \
  *     -H 'content-type: application/json' \

  * @apiSuccessExample {json} Success-Response:
  {
    "_id": "5b4f0797249e6a4d19a8b7aa",
    "addressLine": "",
    "city": "",
    "zip": "",
    "state": "",
    "fullAddress": "",
    "createdAt": "2018-07-18T09:25:43.943Z",
    "updatedAt": "2018-07-18T09:25:43.944Z",
    "isDeleted": false
  }

  * @apiUse householdObject

  * @apiErrorExample {json} Error-Response:
    [{param: 'userId', message: 'User not found'}]

  * @apiError {Object} UserNotFound {param: 'userId', message: 'User not found'}
  * @apiError {Object} UserDontHaveHousehold {param: 'userId', message: 'User do not have household'}
  * @apiError {Object} HouseholdNotFound {param: 'householdId', message: 'Household not found'}
  * @apiUse accessTokenError
  */

router.get('/my', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const reqData = await householdValidate.checkHousehold(req.request.user);
    return householdAction.getUserHousehold(reqData);
  });
});

/**
  * @apiName Update
  * @api {PUT} /api/v1/household/update Update

  * @apiVersion 0.0.1

  * @apiGroup Household

  * @apiHeader {String} Content-Type=application/json Content-Type
  * @apiHeader {String} Authorization User bearer access token

  * @apiParam  {String} [addressLine] Household address
  * @apiParam  {String} [city] Household city
  * @apiParam  {String} [zip] Household zip
  * @apiParam  {String} [state] Household state
  * @apiParam  {String} [fullAddress] Household fullAddress

  * @apiExample {curl} Example usage:
  * curl -X PUT http://localhost:3000/api/v1/household/update \
  *   -H 'authorization: Bearer WvjrYW5aeK/JX+5lXjTG3rTg0U6ODn2xUwEbESRhhv/TfqBtScG0bW1CFi6HINecGbZKGhjkkLHCQcpseFI4GIDXiZGa/SYia68VkuIy7bVNwGo/oX1p9oTSge8hWw==' \
  *   -H 'content-type: application/json' \
  *     -d '{"addressLine": "910 N Harbor Dr","city": "San Diego","zip": "92101","state": "CA","fullAddress": "910 N Harbor Dr, San Diego, CA 92101, USA"}'

  * @apiSuccessExample {json} Success-Response:
  {
    "_id": "5b4f0797249e6a4d19a8b7aa",
    "addressLine": "910 N Harbor Dr",
    "city": "San Diego",
    "zip": "92101",
    "state": "CA",
    "fullAddress": "910 N Harbor Dr, San Diego, CA 92101, USA",
    "createdAt": "2018-07-18T09:25:43.943Z",
    "updatedAt": "2018-07-18T10:23:32.863Z",
    "isDeleted": false
  }

  * @apiUse householdObject

  * @apiErrorExample {json} Error-Response:
    [{param: 'userId', message: 'User not found'}]

  * @apiError {Object} UserNotFound {param: 'userId', message: 'User not found'}
  * @apiError {Object} UserDontHaveHousehold{param: 'userId', message: 'User do not have household'}
  * @apiError {Object} HouseholdNotFound {param: 'householdId', message: 'Household not found'}
  * @apiError {Object} AddressLineRequired {param: 'addressLine', message: 'Valid addressLine is required'}
  * @apiError {Object} CityRequired {param: 'city', message: 'Valid city is required'}
  * @apiError {Object} ZipRequired {param: 'zip', message: 'Valid zip is required'}
  * @apiError {Object} StateRequired {param: 'state', message: 'Valid state is required'}
  * @apiError {Object} FullAddressRequired {param: 'fullAddress', message: 'Valid fullAddress is required'}
  * @apiUse accessTokenError
  */

router.put('/update', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const reqData = await householdValidate.update(req.request.body, req.request.user);
    return householdAction.update(reqData);
  });
});

export const routerDeep = koaRouter({
  prefix: '/api/v1/deeplink',
});

routerDeep.get('/:householdId', async (req, next) => req.render('index', req.params));
