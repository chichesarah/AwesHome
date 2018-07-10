import koaRouter from 'koa-router';

import sharedListAction from '../action/sharedList';
import sharedListValidate from '../validator/sharedList';
import { bearerMiddleware } from '../component/passport';
import middlewareWrapper from '../component/middlewareWrapper';

export const router = koaRouter({
  prefix: '/api/v1/sharedList',
});

router.all('/*', bearerMiddleware);

router.post('/create', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const sharedList = await sharedListValidate.create(req.request.body, req.request.user._id);

    return sharedListAction.create(sharedList.name, req.request.user._id, sharedList.member);
  });
});
