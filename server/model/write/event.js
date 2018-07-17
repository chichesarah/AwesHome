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
        isDeleted: false,
      },
    });
  }

  async getMemberByEventId(_id) {
    const event = await eventWrite.findRow({
      query: {
        _id,
        isDeleted: false,
      },
    });

    return event.member;
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

  delete(_id) {
    return eventWrite.updateRow({
      query: {
        _id,
      },
      data: {
        isDeleted: true,
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

