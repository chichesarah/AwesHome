import koaRouter from 'koa-router';

import taskNameAction from '../action/taskName';
import taskNameValidate from '../validator/taskName';
import { bearerMiddleware } from '../component/passport';
import middlewareWrapper from '../component/middlewareWrapper';

export const router = koaRouter({
  prefix: '/api/v1/taskName',
});

router.all('/*', bearerMiddleware);

/**

   * @apiName GetAllTasksName
   * @api {GET} /api/v1/taskName/all Get all tasks name

   * @apiVersion 0.0.1

   * @apiGroup taskName

   * @apiHeader {String} Content-Type=application/json Content-Type
   * @apiHeader {String} Authorization User bearer access token

   * @apiExample {curl} Example usage:
   *     curl 'http://localhost:3000/api/v1/taskName/all'
   *     -H 'Authorization: Bearer Bn8sMqf1we82ZGhADnv/CpMwR+nvuv0Av4FiqefHGbpIWbdWn7sJM8J1HTjV9KXL/A//qWYKq4aCFOuc8DUXna5raYaArruIBeRKFRM+bLQ0IXYbUwMBhw=='
   *     -X GET

   * @apiSuccessExample {json} Success-Response:
    [{"_id": "5b44464ea85ca854ed3bb85f", "isDeleted": false, "name": "new name", "createdAt": "2018-07-10T05:38:22.225Z", "updatedAt": "2018-07-10T05:38:22.225Z", "__v": 0}]

   * @apiErrorExample {json} Error-Response:
    [{ param : 'accessToken', message : 'Access token is incorrect'}]

   * @apiUse accessTokenError
*/

router.get('/all', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => taskNameAction.getAll());
});


/**

   * @apiSuccess  {Boolean} isDeleted false
   * @apiSuccess  {String} _id Users id
   * @apiSuccess  {String} name Name
   * @apiSuccess  {String} createdAt Date
   * @apiSuccess  {String} updatedAt Date
   * @apiSuccess  {Number} __v Number

   * @apiName CreateNewTaskName
   * @api {POST} /api/v1/taskName Create a new task name

   * @apiVersion 0.0.1

   * @apiGroup taskName

   * @apiHeader {String} Content-Type=application/json Content-Type
   * @apiHeader {String} Authorization User bearer access token

   * @apiParam  {String} name Name

   * @apiExample {curl} Example usage:
   *     curl 'http://localhost:3000/api/v1/taskName'
   *      -H 'Content-Type: application/json'
   *      -H 'Authorization: Bearer Bn8sMqf1we82ZGhADnv/CpMwR+nvuv0Av4FiqefHGbpIWbdWn7sJM8J1HTjV9KXL/A//qWYKq4aCFOuc8DUXna5raYaArruIBeRKFRM+bLQ0IXYbUwMBhw=='
   *      -X POST
   *      -d  '{"name":"test name"}'

   * @apiSuccessExample {json} Success-Response:
    {"isDeleted": false, "_id": "5b44464ea85ca854ed3bb85f", "name": "new name", "createdAt": "2018-07-10T05:38:22.225Z", "updatedAt": "2018-07-10T05:38:22.225Z", "__v": 0}

   * @apiErrorExample {json} Error-Response:
    [{param:"name",message:"Name is already exists"}]

   * @apiError {Object} NameRequired {param:"name",message:"Name is required"}
   * @apiError {Object} NameExist {param:"name",message:"Name is already exists"}
   * @apiUse accessTokenError
*/

router.post('/', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const name = await taskNameValidate.create(req.request.body);

    return taskNameAction.create(name);
  });
});
