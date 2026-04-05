import express from 'express';
import { getSummary, getCategoryTotals, getMonthlyTrends, getRecentActivity } from '../controllers/dashboard.controller.js';
import { authMiddleware, authorize } from '../middleware/auth.js';

const dashboardRouter = express.Router();

dashboardRouter.use(authMiddleware);

dashboardRouter.get('/summary', authorize("viewer", "analyst", "admin"), getSummary);
dashboardRouter.get('/categories', authorize("viewer", "analyst", "admin"), getCategoryTotals);
dashboardRouter.get('/trends', authorize("viewer", "analyst", "admin"), getMonthlyTrends);
dashboardRouter.get('/recent', authorize("viewer", "analyst", "admin"), getRecentActivity);

export default dashboardRouter;