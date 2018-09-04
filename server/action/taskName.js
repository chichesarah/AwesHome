import taskWrite from '../model/write/taskName';

class TaskNameAction {
  getAll() {
    return taskWrite.getAll();
  }

  create(data) {
    return taskWrite.addName(data);
  }

  delete(data) {
    return taskWrite.delete(data);
  }
}

export default new TaskNameAction();
