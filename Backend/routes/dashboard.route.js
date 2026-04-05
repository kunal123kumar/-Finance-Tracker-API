import express from 'express';
import { getSummary, getCategoryTotals, getMonthlyTrends, getRecentActivity } from '../controllers/dashboard.controller.js';
import { authMiddleware, authorize } from '../middleware/auth.js';

const dashboardRouter = express.Router();

dashboardRouter.use(authMiddleware);

dashboardRouter.get('/summary', authorize('Viewer', 'viewer', 'analyst','Admin','Analyst', 'admin'), getSummary);
dashboardRouter.get('/categories', authorize('Viewer', 'viewer', 'analyst','Admin','Analyst', 'admin'), getCategoryTotals);
dashboardRouter.get('/trends', authorize('Viewer', 'viewer', 'analyst','Admin','Analyst', 'admin'), getMonthlyTrends);
dashboardRouter.get('/recent', authorize('Viewer', 'viewer', 'analyst','Admin','Analyst', 'admin'), getRecentActivity);

export default dashboardRouter;