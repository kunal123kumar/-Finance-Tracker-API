import express from 'express';
import { createTransaction, getTransactions,getTransactionsById, updateTransaction, deleteTransaction } from '../controllers/transaction.controller.js';
import { transactionRules, validate } from '../middleware/validate.js';
import { authMiddleware } from '../middleware/auth.js';
import { authorize } from '../middleware/auth.js';

const transactionRoutes  = express.Router();

transactionRoutes.use(authMiddleware);

transactionRoutes .get("/", authorize("viewer", "analyst", "admin"), getTransactions);
transactionRoutes .get("/:id", authorize("viewer", "analyst", "admin"), getTransactionsById);

transactionRoutes.post("/", authorize("admin"), transactionRules, validate, createTransaction);
transactionRoutes.put("/:id", authorize("admin"), transactionRules, validate, updateTransaction);
transactionRoutes.delete("/:id", authorize("admin"), deleteTransaction);

export default transactionRoutes;