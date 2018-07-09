import koaRouter from 'koa-router';

import taskNameAction from '../action/taskName';
import { taskNameValidate } from '../validator/taskName';
import { bearerMiddleware } from '../component/passport';
import middlewareWrapper from '../component/middlewareWrapper';
// import config from '../config';

export const router = koaRouter({
  prefix: '/api/v1/taskName',
});

router.all('/*', bearerMiddleware);

router.get('/all', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => taskNameAction.getAll());
});

router.post('/', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const name = await taskNameValidate.create(req.request.body);

    return taskNameAction.create(name);
  });
});
