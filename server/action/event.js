import _ from 'lodash';
import mongoose from 'mongoose';

import eventWrite from '../model/write/event';
import eventBus from '../component/eventBus';
import { convertDataUtc, convertDateToResponse } from './task';

class EventAction {
  async create(data) {
    const eventData = _.cloneDeep(data);

    if (data.allDay) {
      const startDate = convertDataUtc(eventData.startDate);
      const endDate = convertDataUtc(eventData.endDate);

      eventData.startDate = convertDateToResponse(startDate);
      eventData.endDate = convertDateToResponse(endDate.add(1, 'd').add(-1, 's'));
    }

    const event = await eventWrite.create(eventData);

    eventBus.emit('createEventObj', event);
    return event;
  }

  async delete(data) {
    eventBus.emit('deleteEventObj', data);

    const event = await eventWrite.delete(data._id);
    return event;
  }

  async update(data) {
    const eventData = _.cloneDeep(data);

    if (eventData.member && eventData.member.length) {
      const current = await eventWrite.getMemberByEventId(eventData._id);
      const oldMember = current.map(i => i.toString());
      const newMember = _.difference(eventData.member, oldMember).map(i => mongoose.Types.ObjectId(i));
      const event = await eventWrite.update(eventData);

      eventBus.emit('addGuestPushEventObj', _.assignIn(event, { newMember }));
    }

    if (eventData.allDay) {
      const startDate = convertDataUtc(eventData.startDate);
      const endDate = convertDataUtc(eventData.endDate);

      eventData.startDate = convertDateToResponse(startDate);
      eventData.endDate = convertDateToResponse(endDate.add(1, 'd').add(-1, 's'));
    }

    return eventWrite.update(eventData);
  }

  async addGuest(data) {
    const current = await eventWrite.getMemberByEventId(data.eventId);

    const oldMember = current.map(i => i.toString());
    const newMember = _.difference(data.member, oldMember).map(i => mongoose.Types.ObjectId(i));

    const event = await eventWrite.addGuest(data);
    eventBus.emit('addGuestPushEventObj', _.assignIn(event, { newMember }));
    return event;
  }

  getOne(event) {
    return eventWrite.getOne(event);
  }
}

export default new EventAction();
