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

  getEventByDuration({ householdId, startDate, endDate }) {
    const start = startDate.toDate();
    const end = endDate.toDate();

    return eventWrite.aggregateRows({
      query: [
        {
          $match: {
            householdId,
            startDate: { $lte: end },
            endDate: { $gte: start },
            isDeleted: false,
          },
        },
        {
          $unwind: {
            path: '$member',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'member',
            foreignField: '_id',
            as: 'member',
          },
        },
        {
          $unwind: {
            path: '$member',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            isDeleted: 1,
            householdId: 1,
            notify: 1,
            startDate: 1,
            endDate: 1,
            title: 1,
            fullAddress: 1,
            ownerId: 1,
            allDay: 1,
            createdAt: 1,
            updatedAt: 1,
            'member._id': 1,
            'member.firstName': 1,
            'member.lastName': 1,
            'member.avatar': 1,
            'member.avatarId': 1,
            'member.createdAt': 1,
            'member.updatedAt': 1,
            'member.isDeleted': 1,
          },
        },
        {
          $group: {
            _id: {
              _id: '$_id',
              isDeleted: '$isDeleted',
              householdId: '$householdId',
              notify: '$notify',
              startDate: '$startDate',
              endDate: '$endDate',
              title: '$title',
              fullAddress: '$fullAddress',
              ownerId: '$ownerId',
              allDay: '$allDay',
              createdAt: '$createdAt',
              updatedAt: '$updatedAt',
            },
            member: {
              $push: '$member',
            },
          },
        },
        {
          $project: {
            _id: '$_id._id',
            isDeleted: '$_id.isDeleted',
            householdId: '$_id.householdId',
            notify: '$_id.notify',
            startDate: '$_id.startDate',
            endDate: '$_id.endDate',
            member: '$member',
            title: '$_id.title',
            fullAddress: '$_id.fullAddress',
            ownerId: '$_id.ownerId',
            allDay: '$_id.allDay',
            taskName: '$_id.taskName',
            createdAt: '$_id.createdAt',
            updatedAt: '$_id.updatedAt',
          },
        },
      ],
    });
  }

  getOne(event) {
    return eventWrite.aggregateRows({
      query: [
        {
          $match: {
            _id: event._id,
            isDeleted: false,
          },
        },
        {
          $unwind: {
            path: '$member',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'member',
            foreignField: '_id',
            as: 'member',
          },
        },
        {
          $unwind: {
            path: '$member',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            isDeleted: 1,
            householdId: 1,
            notify: 1,
            startDate: 1,
            endDate: 1,
            title: 1,
            fullAddress: 1,
            ownerId: 1,
            allDay: 1,
            createdAt: 1,
            updatedAt: 1,
            'member._id': 1,
            'member.firstName': 1,
            'member.lastName': 1,
            'member.avatar': 1,
            'member.avatarId': 1,
            'member.createdAt': 1,
            'member.updatedAt': 1,
            'member.isDeleted': 1,
          },
        },
        {
          $group: {
            _id: {
              _id: '$_id',
              isDeleted: '$isDeleted',
              householdId: '$householdId',
              notify: '$notify',
              startDate: '$startDate',
              endDate: '$endDate',
              title: '$title',
              fullAddress: '$fullAddress',
              ownerId: '$ownerId',
              allDay: '$allDay',
              createdAt: '$createdAt',
              updatedAt: '$updatedAt',
            },
            member: {
              $push: '$member',
            },
          },
        },
        {
          $project: {
            _id: '$_id._id',
            isDeleted: '$_id.isDeleted',
            householdId: '$_id.householdId',
            notify: '$_id.notify',
            startDate: '$_id.startDate',
            endDate: '$_id.endDate',
            member: '$member',
            title: '$_id.title',
            fullAddress: '$_id.fullAddress',
            ownerId: '$_id.ownerId',
            allDay: '$_id.allDay',
            taskName: '$_id.taskName',
            createdAt: '$_id.createdAt',
            updatedAt: '$_id.updatedAt',
          },
        },
      ],
    });
  }
}

export default new EventModel();

