import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(cors());

// Special handling for Stripe Webhooks to use raw body
app.use((req, res, next) => {
    if (req.originalUrl === '/api/bookings/webhook') {
        next();
    } else {
        express.json()(req, res, next);
    }
});

app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
    res.send('Rejoice Events & Decor API Running');
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
