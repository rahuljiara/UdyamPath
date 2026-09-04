import express from 'express';
import {
  getOffers,
  getOfferStats,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer
} from '../controllers/offerController.js';
import protect from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getOffers)
  .post(authorizeRoles('ADMIN', 'TPO', 'RECRUITER'), createOffer);

router.get('/stats', getOfferStats);

router.route('/:id')
  .get(getOfferById)
  .put(updateOffer)
  .delete(authorizeRoles('ADMIN', 'TPO'), deleteOffer);

export default router;
