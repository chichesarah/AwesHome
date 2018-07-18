import koaRouter from 'koa-router';

import { neighbourhoodAction } from '../action/neighbourhood';
import middlewareWrapper from '../component/middlewareWrapper';

export const router = koaRouter({
  prefix: '/api/v1/neighbourhood',
});

/**
  * @apiName GetNeighbourhoodList
  * @api {GET} /api/v1/neighbourhood Get neighbourhood list

  * @apiVersion 0.0.1

  * @apiGroup Neighbourhood

  * @apiExample {curl} Example usage:
  * curl -X GET http://localhost:3000/api/v1/neighbourhood

  * @apiSuccessExample {json} Success-Response:
  [
    {
        "_id": "5b4ecf82c297bf21e7c9b877",
        "isDeleted": false,
        "name": "Arden Heights",
        "createdAt": "2018-07-18T05:26:26.837Z",
        "updatedAt": "2018-07-18T05:26:26.837Z",
        "__v": 0
    },
    {
        "_id": "5b4ecf82c297bf21e7c9b878",
        "isDeleted": false,
        "name": "Annadale",
        "createdAt": "2018-07-18T05:26:26.844Z",
        "updatedAt": "2018-07-18T05:26:26.844Z",
        "__v": 0
    },
    {
        "_id": "5b4ecf82c297bf21e7c9b87a",
        "isDeleted": false,
        "name": "Astoria",
        "createdAt": "2018-07-18T05:26:26.854Z",
        "updatedAt": "2018-07-18T05:26:26.854Z",
        "__v": 0
    },
    {
        "_id": "5b4ecf82c297bf21e7c9b87c",
        "isDeleted": false,
        "name": "Bath Beach",
        "createdAt": "2018-07-18T05:26:26.858Z",
        "updatedAt": "2018-07-18T05:26:26.858Z",
        "__v": 0
    },
    {
        "_id": "5b4ecf82c297bf21e7c9b87d",
        "isDeleted": false,
        "name": "Bay Ridge",
        "createdAt": "2018-07-18T05:26:26.859Z",
        "updatedAt": "2018-07-18T05:26:26.859Z",
        "__v": 0
    },
    {
        "_id": "5b4ecf82c297bf21e7c9b87b",
        "isDeleted": false,
        "name": "Arverne",
        "createdAt": "2018-07-18T05:26:26.854Z",
        "updatedAt": "2018-07-18T05:26:26.854Z",
        "__v": 0
    },
    {
        "_id": "5b4ecf82c297bf21e7c9b87f",
        "isDeleted": false,
        "name": "Battery Park City",
        "createdAt": "2018-07-18T05:26:26.859Z",
        "updatedAt": "2018-07-18T05:26:26.859Z",
        "__v": 0
    },
  ]

  * @apiSuccess  {Object[]}    neighbourhoods             List of neighbourhoods
  * @apiSuccess  {String}      neighbourhood._id          Neighbourhood id
  * @apiSuccess  {String}      neighbourhood.isDeleted    Is neighbourhood deleted
  * @apiSuccess  {String}      neighbourhood.name         Neighbourhood name
  * @apiSuccess  {String}      neighbourhood.createdAt    Neighbourhood create date
  * @apiSuccess  {String}      neighbourhood.updatedAt    Neighbourhood update date
  */

router.get('/', async (req, next) => {
  await middlewareWrapper.wrape(req, next, () => neighbourhoodAction.getList());
});
