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
      },
    });
  }
}

export default new TaskNameModel();
