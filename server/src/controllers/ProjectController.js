import ProjectRepo from "../repos/ProjectRepo.js";

export const createProject = async (req, res) => {
  try {
    const project = await ProjectRepo.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Error creating project" });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectRepo.findAll();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects" });
  }
};

export const getProject = async (req, res) => {
  try {
    const project = await ProjectRepo.findById(req.params.id);

    if (!project)
      return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Error fetching project" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const updated = await ProjectRepo.update(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating project" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    await ProjectRepo.softDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project" });
  }
};