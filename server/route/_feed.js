import koaRouter from 'koa-router';

import feedAction from '../action/feed';
import { bearerMiddleware } from '../component/passport';
import middlewareWrapper from '../component/middlewareWrapper';

export const router = koaRouter({
  prefix: '/api/v1/feed',
});

router.all('/*', bearerMiddleware);

router.get('/all', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => feedAction.getAllFeed(req.request.user._id));
});
