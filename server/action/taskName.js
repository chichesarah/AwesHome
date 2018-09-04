import taskWrite from '../model/write/taskName';

class TaskNameAction {
  getAll(userId) {
    return taskWrite.getAll(userId);
  }

  create(data) {
    return taskWrite.addName(data);
  }

  delete(data) {
    return taskWrite.delete(data);
  }
}

export default new TaskNameAction();
