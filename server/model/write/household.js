import dbList from './../../db';

const householdWrite = dbList.write('household');

class HouseholdModel {
  newHousehold() {
    return householdWrite.insertRow({ });
  }

  findById(_id) {
    return householdWrite.findRow({
      query: {
        _id,
        isDeleted: false,
      },
    });
  }

  updateHousehold(data) {
    return householdWrite.updateRow({
      query: { _id: data._id },
      data,
    });
  }
}

export default new HouseholdModel();
