import koaRouter from 'koa-router';

import udidAction from '../action/udid';
import udidValidate from '../validator/udid';
import { bearerMiddleware } from '../component/passport';
import middlewareWrapper from '../component/middlewareWrapper';

export const router = koaRouter({
  prefix: '/api/v1/udid',
});

router.all('/*', bearerMiddleware);

router.post('/create', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const udid = await udidValidate.create(req.request.body, req.request.user._id);

    return udidAction.create(udid, req.request.user._id);
  });
});
