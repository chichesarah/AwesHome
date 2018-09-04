import dbList from './../../db';

const taskNameWrite = dbList.write('taskName');
const userWrite = dbList.write('user');

class TaskNameModel {
  async getAll(_id) {
    const user = await userWrite.findRow({
      query: {
        _id,
      },
    });

    return taskNameWrite.aggregateRows({
      query: [
        {
          $match: {
            $or: [
              {
                householdId: user.householdId,
              },
              {
                householdId: null,
              },
            ],
          },
        },
      ],
    });
  }

  addName(data) {
    return taskNameWrite.insertRow({
      data: {
        name: data.name,
        householdId: data.householdId,
      },
    });
  }

  delete(data) {
    return taskNameWrite.deleteRow({
      query: {
        _id: data._id,
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
