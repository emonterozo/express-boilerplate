require('dotenv').config();
import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// application routes
import homeRouter from '@routes/home';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

app.use('/home', homeRouter);

app.get('/', (req, res) => {
  res.send('Welcome to Express Boilerplate');
});

app.listen(process.env.PORT, () => {
  console.log(`now listening on port ${process.env.PORT}`);
});
