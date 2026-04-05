import { body, validationResult } from 'express-validator';
 
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
}
const registerRules = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['Viewer', 'analyst', 'admin']).withMessage('Role must be either Viewer, analyst, or admin'),
];

const loginRules = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
];
 const transactionRules = [
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
    body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('date').optional().isISO8601().withMessage('Invalid date format'),
    body('notes').optional().isLength({ max: 500 }).withMessage('Notes max 500 characters'),
];



export { registerRules, loginRules, validate, transactionRules };