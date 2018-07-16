import _ from 'lodash';
import dbList from './../../db';

const eventWrite = dbList.write('event');

class EventModel {
  create(data) {
    return eventWrite.insertRow({
      data,
    });
  }

  findEventById(_id) {
    return eventWrite.findRow({
      query: {
        _id,
      },
    });
  }

  async getMemberByEventId(member, _id) {
    const event = await eventWrite.findRow({
      query: {
        _id,
      },
    });

    const oldMember = event.member.map(i => i.toString());
    const newMember = _.difference(oldMember, member);

    return newMember;
  }

  async addGuest(data) {
    const event = await eventWrite.updateRow({
      query: {
        _id: data.eventId,
      },
      data,
    });

    return event;
  }

  delete(data) {
    return eventWrite.deleteRow({
      query: {
        _id: data._id,
      },
    });
  }

  update(data) {
    return eventWrite.updateRow({
      query: {
        _id: data._id,
      },
      data,
    });
  }
}

export default new EventModel();

