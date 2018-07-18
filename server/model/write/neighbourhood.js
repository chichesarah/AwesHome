import dbList from './../../db';

const neighbourhoodWrite = dbList.write('neighbourhood');

class NeighbourhoodModel {
  getAll() {
    return neighbourhoodWrite.findRows();
  }

  addNeighbourhood(name) {
    return neighbourhoodWrite.insertRow({
      data: {
        name,
      },
    });
  }

  findByName(name) {
    return neighbourhoodWrite.findRow({
      query: {
        name,
        isDeleted: false,
      },
    });
  }

  findById(_id) {
    return neighbourhoodWrite.findRow({
      query: {
        _id,
        isDeleted: false,
      },
    });
  }
}

export default new NeighbourhoodModel();
