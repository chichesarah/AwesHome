import dbList from './../../db';

const taskNameWrite = dbList.write('taskName');

class TaskNameModel {
  getAll() {
    return taskNameWrite.findRows();
  }

  addName(name) {
    return taskNameWrite.insertRow({
      data: {
        name,
      },
    });
  }

  findByName(name) {
    return taskNameWrite.findRow({
      query: {
        name,
        isDeleted: false,
      },
    });
  }

  findById(_id) {
    return taskNameWrite.findRow({
      query: {
        _id,
        isDeleted: false,
      },
    });
  }
}

export default new TaskNameModel();
