const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const {
  createProject,
  getProjects,
  getProject,
  addMember,
  deleteProject,
} = require('../controllers/projectController');

router.post('/', verifyToken, isAdmin, createProject);
router.get('/', verifyToken, getProjects);
router.get('/:id', verifyToken, getProject);
router.post('/:id/members', verifyToken, isAdmin, addMember);
router.delete('/:id', verifyToken, isAdmin, deleteProject);

module.exports = router;