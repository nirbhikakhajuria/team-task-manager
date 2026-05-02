const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const {
  createTask,
  getProjectTasks,
  updateTask,
  deleteTask,
  getMyTasks,
} = require('../controllers/taskController');

// Dashboard route
router.get('/my', verifyToken, getMyTasks);

// Project-specific task routes
router.post('/project/:projectId', verifyToken, createTask);
router.get('/project/:projectId', verifyToken, getProjectTasks);

// Task-level routes
router.put('/:id', verifyToken, updateTask);
router.delete('/:id', verifyToken, isAdmin, deleteTask);

module.exports = router;