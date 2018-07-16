import koaRouter from 'koa-router';

import eventAction from '../action/event';
import eventValidate from '../validator/event';
import { bearerMiddleware } from '../component/passport';
import middlewareWrapper from '../component/middlewareWrapper';

export const router = koaRouter({
  prefix: '/api/v1',
});

router.all('/*', bearerMiddleware);

router.put('/addGuest', async (req, next) => {
  await middlewareWrapper.wrape(req, next, async () => {
    const member = await eventValidate.addGuest(req.request.body, req.request.user._id);
    // console.log('guest', member)
    // return eventAction.addGuest(event);
  });
});
