import _ from 'lodash';
import mongoose from 'mongoose';
import dbList from './../../db';

const sharedListWrite = dbList.write('sharedList');

class SharedListModel {
  create(name, ownerId, member, householdId) {
    return sharedListWrite.insertRow({
      data: {
        name,
        ownerId,
        member,
        householdId,
      },
    });
  }

  findByName(name) {
    return sharedListWrite.findRow({
      query: {
        name,
        isDeleted: false,
      },
    });
  }

  findById(id) {
    return sharedListWrite.findRow({
      query: {
        _id: id,
      },
    });
  }

  async findFullDataById(id) {
    const sharedList = await sharedListWrite.aggregateRows({
      query: [
        {
          $match: {
            _id: {
              $eq: mongoose.Types.ObjectId(id),
            },
            isDeleted: false,
          },
        },
        {
          $unwind: {
            path: '$item',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'item.memberId',
            foreignField: '_id',
            as: 'item.member',
          },
        },
        {
          $unwind: {
            path: '$item.member',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            isDeleted: 1,
            householdId: 1,
            member: 1,
            name: 1,
            ownerId: 1,
            createdAt: 1,
            updatedAt: 1,
            'item._id': 1,
            'item.status': 1,
            'item.memberId': 1,
            'item.name': 1,
            'item.member._id': 1,
            'item.member.firstName': 1,
            'item.member.lastName': 1,
            'item.member.avatar': 1,
            'item.member.avatarId': 1,
            'item.member.createdAt': 1,
            'item.member.updatedAt': 1,
            'item.member.isDeleted': 1,
          },
        },
        {
          $group: {
            _id: {
              _id: '$_id',
              isDeleted: '$isDeleted',
              householdId: '$householdId',
              member: '$member',
              name: '$name',
              ownerId: '$ownerId',
              createdAt: '$createdAt',
              updatedAt: '$updatedAt',
            },
            item: {
              $push: {
                $cond: [
                  {
                    $not: ['$item._id'],
                  },
                  null,
                  '$item',
                ],
              },
            },
          },
        },
        {
          $project: {
            _id: '$_id._id',
            isDeleted: '$_id.isDeleted',
            householdId: '$_id.householdId',
            member: '$_id.member',
            name: '$_id.name',
            ownerId: '$_id.ownerId',
            createdAt: '$_id.createdAt',
            updatedAt: '$_id.updatedAt',
            item: {
              $filter: {
                input: '$item',
                as: 'element',
                cond: {
                  $ne: ['$$element', null],
                },
              },
            },
          },
        },
      ],
    });

    if (!sharedList || !sharedList.length) {
      return null;
    }

    return sharedList[0];
  }

  async addItem(item) {
    const sharedList = await sharedListWrite.findRow({
      query: {
        _id: item.sharedListId,
        isDeleted: false,
      },
    });

    sharedList.item.push(item);

    const result = await sharedListWrite.updateRow({
      query: {
        _id: item.sharedListId,
      },
      data: sharedList,
    });

    return result;
  }

  async checkItem(sharedListId, itemId, status) {
    const sharedList = await sharedListWrite.findRow({
      query: {
        _id: sharedListId,
        isDeleted: false,
      },
    });

    const itemObj = _.find(sharedList.item, i => i._id.toString() === itemId);
    itemObj.status = status;

    const result = await sharedListWrite.updateRow({
      query: {
        _id: sharedListId,
      },
      data: sharedList,
    });

    return result;
  }

  deleteSharedList(_id) {
    return sharedListWrite.deleteRow({
      query: {
        _id,
      },
    });
  }

  findAllSharedList(userId) {

    return sharedListWrite.aggregateRows({
      query: [
        {
          $match: {
            member: {
              $eq: mongoose.Types.ObjectId(userId),
            },
            isDeleted: false,
          },
        },
        {
          $unwind: {
            path: '$item',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'item.memberId',
            foreignField: '_id',
            as: 'item.member',
          },
        },
        {
          $unwind: {
            path: '$item.member',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            isDeleted: 1,
            householdId: 1,
            member: 1,
            name: 1,
            ownerId: 1,
            createdAt: 1,
            updatedAt: 1,
            'item._id': 1,
            'item.status': 1,
            'item.memberId': 1,
            'item.name': 1,
            'item.member._id': 1,
            'item.member.firstName': 1,
            'item.member.lastName': 1,
            'item.member.avatar': 1,
            'item.member.avatarId': 1,
            'item.member.createdAt': 1,
            'item.member.updatedAt': 1,
            'item.member.isDeleted': 1,
          },
        },
        {
          $group: {
            _id: {
              _id: '$_id',
              isDeleted: '$isDeleted',
              householdId: '$householdId',
              member: '$member',
              name: '$name',
              ownerId: '$ownerId',
              createdAt: '$createdAt',
              updatedAt: '$updatedAt',
            },
            item: {
              $push: {
                $cond: [
                  {
                    $not: ['$item._id'],
                  },
                  null,
                  '$item',
                ],
              },
            },
          },
        },
        {
          $project: {
            _id: '$_id._id',
            isDeleted: '$_id.isDeleted',
            householdId: '$_id.householdId',
            member: '$_id.member',
            name: '$_id.name',
            ownerId: '$_id.ownerId',
            createdAt: '$_id.createdAt',
            updatedAt: '$_id.updatedAt',
            item: {
              $filter: {
                input: '$item',
                as: 'element',
                cond: {
                  $ne: ['$$element', null],
                },
              },
            },
          },
        },
      ],
    });
  }
}

export default new SharedListModel();
