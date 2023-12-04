const express = require('express');

const isLoggedIn = require('../middlewares/isLoggedIn');
const taskController = require('../controllers/taskController');

const router = express.Router();

router.use(isLoggedIn);

router.get('/search', taskController.search);

router
 .route('/')
 .get(taskController.getTasksByUser)
 .post(taskController.createTask);

router
 .route('/:id')
 .patch(taskController.updateTask)
 .delete(taskController.deleteTask);

module.exports = router;
