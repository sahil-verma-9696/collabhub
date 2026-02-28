import Project from "../models/ProjectSchema.js";

class ProjectRepo {

  async create(data) {
    return await Project.create(data);
  }

  async findAll() {
    return await Project.find({ isDeleted: false });
  }

  async findById(id) {
    return await Project.findOne({ _id: id, isDeleted: false });
  }

  async update(id, data) {
    return await Project.findByIdAndUpdate(id, data, { new: true });
  }

  async softDelete(id) {
    return await Project.findByIdAndUpdate(id, {
      isDeleted: true,
    });
  }
}

export default new ProjectRepo();