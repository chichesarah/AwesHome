import _ from 'lodash';

import eventWrite from '../model/write/event';
import { userAction } from './user';
import eventBus from '../component/eventBus';

class EventAction {
  async create(data) {
    const address = await userAction.getGoogleAddress(data.fullAddress);
    data.fullAddress = address.fullAddress;

    const event = await eventWrite.create(data);

    eventBus.emit('createEventObj', event);
    return event;
  }

  async delete(data) {
    eventBus.emit('deleteEventObj', data);

    const event = await eventWrite.delete(data._id);
    return event;
  }

  async update(data) {
    if (data.fullAddress) {
      const address = await userAction.getGoogleAddress(data.fullAddress);
      data.fullAddress = address.fullAddress;
    }

    const event = await eventWrite.update(data);
    return event;
  }

  async addGuest(data) {
    const current = await eventWrite.getMemberByEventId(data.eventId);

    const oldMember = current.map(i => i.toString());
    const newMember = _.difference(data.member, oldMember);

    const event = await eventWrite.addGuest(data);

    eventBus.emit('addGuestPushEventObj', { event, newMember });
    return event;
  }
}

export default new EventAction();
