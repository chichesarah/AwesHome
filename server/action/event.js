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

    const event = await eventWrite.delete(data);
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
    const event = await eventWrite.addGuest(data);
    return event;
  }
}

export default new EventAction();
