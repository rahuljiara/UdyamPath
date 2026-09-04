import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';

const router = express.Router();

// Admin only routes
router.use(protect);
router.use(authorizeRoles('ADMIN'));

router.route('/')
  .get(getUsers);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

export default router;
