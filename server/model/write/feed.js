import _ from 'lodash';
import dbList from './../../db';

const feedWrite = dbList.write('feed');

class FeedModel {
  create(data) {
    return feedWrite.insertRow({
      data,
    });
  }

  getAllFeed(householdId) {
    return feedWrite.aggregateRows({
      query: [
        {
          $match: {
            householdId,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $project: {
            isDeleted: 1,
            userId: 1,
            householdId: 1,
            type: 1,
            operation: 1,
            createdAt: 1,
            'user.firstName': 1,
            'user.lastName': 1,
            'user.avatar': 1,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ],
    });
  }
}

export default new FeedModel();
