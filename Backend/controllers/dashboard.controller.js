import Transaction from '../models/transaction.model.js';

const getSummary = async (req, res) => {
    try {
        const totals = await Transaction.aggregate([
            { $match: { createdBy: req.user._id } },  // only user's transactions
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" },
                },
            },
        ]);

        let totalIncome = 0, totalExpense = 0;
        totals.forEach((t) => {
            if (t._id === "income") totalIncome = t.total;
            if (t._id === "expense") totalExpense = t.total;
        });

        res.json({
            success: true,
            data: {
                totalIncome,
                totalExpense,
                netBalance: totalIncome - totalExpense,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
const getCategoryTotals = async (req, res) => {
    try {
        const { type } = req.query;
        const match = { createdBy: req.user._id };  // user filter,
        if (type) match.type = type;

        const categoryTotals = await Transaction.aggregate([
            { $match: match },
            {
                $group: {
                    _id: { category: "$category", type: "$type" },
                    total: { $sum: "$amount" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { total: -1 } },
        ]);

        res.json({ success: true, data: categoryTotals });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
const getMonthlyTrends = async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();

        const trends = await Transaction.aggregate([
            {
                $match: {
                    createdBy: req.user._id,  // user filter, no isDeleted
                    date: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    },
                },
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$date" },
                        type: "$type",
                    },
                    total: { $sum: "$amount" },
                },
            },
            { $sort: { "_id.month": 1 } },
        ]);

        const formatted = {};
        for (let m = 1; m <= 12; m++) {
            formatted[m] = { month: m, income: 0, expense: 0 };
        }
        trends.forEach((t) => {
            formatted[t._id.month][t._id.type] = t.total;
        });

        res.json({ success: true, year, data: Object.values(formatted) });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getRecentActivity = async (req, res) => {
    try {
        const recent = await Transaction.find({ createdBy: req.user._id })  // user filter
            .populate("createdBy", "name")
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({ success: true, data: recent });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export { getSummary, getCategoryTotals, getMonthlyTrends, getRecentActivity };