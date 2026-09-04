import express from 'express';
import {
  getPlacements,
  getPlacementById,
  createPlacement,
  updatePlacement
} from '../controllers/placementController.js';
import protect from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getPlacements)
  .post(authorizeRoles('ADMIN', 'TPO'), createPlacement);

router.route('/:id')
  .get(getPlacementById)
  .put(authorizeRoles('ADMIN', 'TPO'), updatePlacement);

export default router;
