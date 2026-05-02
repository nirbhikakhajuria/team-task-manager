const User = require('./User');
const Project = require('./Project');
const ProjectMember = require('./ProjectMember');
const Task = require('./Task');

// A project is created by a user
Project.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });

// A project has many members (through ProjectMember)
Project.belongsToMany(User, { through: ProjectMember, as: 'members' });
User.belongsToMany(Project, { through: ProjectMember, as: 'projects' });

// A task belongs to a project
Task.belongsTo(Project, { foreignKey: 'projectId' });
Project.hasMany(Task, { foreignKey: 'projectId' });

// A task is assigned to a user
Task.belongsTo(User, { as: 'assignee', foreignKey: 'assignedTo' });
User.hasMany(Task, { as: 'assignedTasks', foreignKey: 'assignedTo' });

module.exports = { User, Project, ProjectMember, Task };