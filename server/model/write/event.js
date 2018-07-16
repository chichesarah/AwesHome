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

    const newMember = _.difference(member, oldMember);

    return newMember;
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

