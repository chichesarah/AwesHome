import _ from 'lodash';

import eventWrite from '../model/write/event';
import eventBus from '../component/eventBus';

class EventAction {
  async create(data) {
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
    return eventWrite.update(data);
  }

  async addGuest(data) {
    const current = await eventWrite.getMemberByEventId(data.eventId);

    const oldMember = current.map(i => i.toString());
    const newMember = _.difference(data.member, oldMember);

    const event = await eventWrite.addGuest(data);

    eventBus.emit('addGuestPushEventObj', { event, newMember });
    return event;
  }

  getOne(event) {
    return eventWrite.getOne(event);
  }
}

export default new EventAction();
