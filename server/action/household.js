import _ from 'lodash';
import moment from 'moment';

import householdWrite from '../model/write/household';
import userWrite from '../model/write/user';
import eventBus from '../component/eventBus';
import { userFreeData } from './user';

const householdFreeData = [
  '_id',

  'addressLine',
  'city',
  'zip',
  'state',
  'fullAddress',

  'createdAt',
  'updatedAt',
  'isDeleted',
];

class HouseholdAction {
  async create(data) {
    const householdObj = await householdWrite.newHousehold();

    const userObj = await userWrite.setHouseholdId(data._id, householdObj._id);

    return _.pick(userObj, userFreeData);
  }

  async connect(data) {
    const userObj = await userWrite.setHouseholdId(data.userObj._id, data.householdObj._id);

    eventBus.emit('joinHousehold', userObj);
    return _.pick(userObj, userFreeData);
  }

  async leave(data) {
    const userObj = await userWrite.setHouseholdId(data._id, null);
    eventBus.emit('leaveHousehold', userObj);
    return _.pick(userObj, userFreeData);
  }

  async getUserHousehold(data) {
    return _.pick(data, householdFreeData);
  }

  async update(data) {
    let householdObj = _.cloneDeep(data.householdObj);
    householdObj = _.assignIn(householdObj, data.body);
    householdObj.updatedAt = moment();

    const newHousehold = await householdWrite.updateHousehold(householdObj);

    return _.pick(newHousehold, householdFreeData);
  }
}

export default HouseholdAction;

export const householdAction = new HouseholdAction();
