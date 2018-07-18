import neighbourhoodWrite from '../model/write/neighbourhood';
import neighbourhoodList from '../constant/neighbourhood.json';

class NeighbourhoodAction {
  setInDB() {
    neighbourhoodList.forEach(async (name) => {
      const neighbourhoodObject = await neighbourhoodWrite.findByName(name);
      if (!neighbourhoodObject) {
        neighbourhoodWrite.addNeighbourhood(name);
      }
    });
  }

  getList() {
    return neighbourhoodWrite.getAll();
  }
}

export default NeighbourhoodAction;

export const neighbourhoodAction = new NeighbourhoodAction();
