const { Project, User, ProjectMember, Task } = require('../models');

// Create a new project (admin only)
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Project name required' });

    const project = await Project.create({
      name,
      description,
      createdBy: req.user.id,
    });

    // Auto-add creator as admin member
    await ProjectMember.create({
      ProjectId: project.id,
      UserId: req.user.id,
      role: 'admin',
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all projects for the logged-in user
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: ['role'] } },
        { model: Task, as: 'Tasks' },
      ],
      where: req.user.role === 'admin' ? {} : { '$members.id$': req.user.id },
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single project
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: ['role'] } },
        { model: Task, as: 'Tasks', include: [{ model: User, as: 'assignee', attributes: ['id', 'name'] }] },
      ],
    });

    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a member to project (admin only)
exports.addMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const already = await ProjectMember.findOne({
      where: { ProjectId: req.params.id, UserId: user.id },
    });
    if (already) return res.status(400).json({ message: 'User already a member' });

    await ProjectMember.create({
      ProjectId: req.params.id,
      UserId: user.id,
      role: role || 'member',
    });

    res.json({ message: 'Member added successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a project (admin only)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    await project.destroy();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};