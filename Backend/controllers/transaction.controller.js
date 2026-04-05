import Transaction from '../models/transaction.model.js';

const createTransaction = async (req, res) => {
    try {
        const { amount, type, category, date, notes } = req.body;
        const transaction = new Transaction({  // ← added `new`
            amount, type, category, date, notes,
            createdBy: req.user._id
        });
        await transaction.save();
        res.status(201).json({ success: true, message: 'Transaction created', transaction });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateTransaction = async (req, res) => {
    try {
        const { amount, type, category, date, notes } = req.body;
        const transaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user._id },
            { amount, type, category, date, notes },
            { new: true }
        );
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        res.status(200).json({ success: true, message: 'Transaction updated', transaction });
    } catch (err) {  // ← was `error`, now `err`
        res.status(500).json({ success: false, message: err.message });  // ← removed quotes
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        res.status(200).json({ success: true, message: 'Transaction deleted' });
    } catch (err) {  // ← was `error`, now `err`
        res.status(500).json({ success: false, message: err.message });  // ← removed quotes
    }
};

const getTransactionsById = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({ _id: req.params.id, createdBy: req.user._id });  // ← fixed
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        res.status(200).json({ success: true, transaction });
    } catch (err) {  // ← was `error`, now `err`
        res.status(500).json({ success: false, message: err.message });  // ← removed quotes
    }
};

const getTransactions = async (req, res) => {
    try {
        const { type, category, startDate, endDate, page = 1, limit = 10 } = req.query;
        let filter = { createdBy: req.user._id };  // ← added user filter
        if (type) filter.type = type;
        if (category) filter.category = new RegExp(category, 'i');
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }
        const skip = (page - 1) * limit;
        const transactions = await Transaction.find(filter)
            .populate('createdBy', 'name email')
            .sort({ date: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await Transaction.countDocuments(filter);
        res.json({ success: true, data: transactions, total, page: Number(page), totalPages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export { getTransactionsById, getTransactions, createTransaction, updateTransaction, deleteTransaction };