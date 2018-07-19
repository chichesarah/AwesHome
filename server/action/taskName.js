import taskWrite from '../model/write/taskName';

class TaskNameAction {
  getAll() {
    return taskWrite.getAll();
  }

  create(name) {
    return taskWrite.addName(name);
  }
}

export default new TaskNameAction();
