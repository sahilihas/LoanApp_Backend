import express from 'express';
import dotenv from 'dotenv';
import connectDb from './db/connectDB.js';
import loanFormRoutes from './routes/loanForm.routes.js';

dotenv.config();

connectDb();
const app = express();

app.use(express.json());
app.use('/api/loan-forms', loanFormRoutes);



app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});