import express from 'express';

import {
  createCommunityApplication,
  getCommunityApplications,
  getCommunityApplicationById,
  updateCommunityApplicationStatus,
  deleteCommunityApplication,
} from '../controllers/communityApplicationsController.js';

const router = express.Router();

router.post('/', createCommunityApplication);
router.get('/', getCommunityApplications);
router.get('/:id', getCommunityApplicationById);
router.put('/:id/status', updateCommunityApplicationStatus);
router.delete('/:id', deleteCommunityApplication);

export default router;