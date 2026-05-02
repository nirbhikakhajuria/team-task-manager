const { Task, User, Project } = require('../models');
const { Op } = require('sequelize');

// Create a task
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });

    const project = await Project.findByPk(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const task = await Task.create({
      title,
      description,
      dueDate,
      assignedTo,
      projectId: req.params.projectId,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all tasks for a project
exports.getProjectTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { projectId: req.params.projectId },
      include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'email'] }],
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update task status or details
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.update(req.body);
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Dashboard — all tasks assigned to logged-in user
exports.getMyTasks = async (req, res) => {
  try {
    const today = new Date();
    const tasks = await Task.findAll({
      where: { assignedTo: req.user.id },
      include: [{ model: Project, attributes: ['id', 'name'] }],
    });

    const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < today && t.status !== 'done');
    const inProgress = tasks.filter(t => t.status === 'in_progress');
    const done = tasks.filter(t => t.status === 'done');
    const todo = tasks.filter(t => t.status === 'todo');

    res.json({ all: tasks, overdue, inProgress, done, todo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};