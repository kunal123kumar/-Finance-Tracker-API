import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
connectDB();




import authRoutes from './routes/auth.routes.js';
import transactionRoutes from './routes/transactions.routes.js';
import dashboardRouter from './routes/dashboard.route.js';
import userRouter from './routes/users.routes.js';

// Initialize Express app

const app = express();


app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/auth', authRoutes);
app.use("/api/users", userRouter);
app.use("/api/transactions", transactionRoutes );
app.use("/api/dashboard", dashboardRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});