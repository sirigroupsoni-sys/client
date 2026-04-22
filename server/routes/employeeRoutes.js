const express = require('express');
const router = express.Router();
const { getMyTasks, updateTaskStatus } = require('../controllers/employeeController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.use(protect);
router.use(restrictTo('employee', 'admin'));

router.get('/my-tasks', getMyTasks);
router.patch('/tasks/:id/status', updateTaskStatus);

module.exports = router;
