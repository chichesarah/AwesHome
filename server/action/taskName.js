import taskWrite from '../model/write/taskName';

class TaskNameAction {
  getAll(data) {
    return taskWrite.getAll(data);
  }

  create(data) {
    return taskWrite.addName(data);
  }

  delete(data) {
    return taskWrite.delete(data);
  }
}

export default new TaskNameAction();
