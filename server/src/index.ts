import 'dotenv/config'; // Load environment variables
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import apiRoutes from './routes';

const app: Express = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json({ limit: '50mb' })); // To parse JSON bodies, increased limit for potential base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // To parse URL-encoded bodies

// API Routes
app.use('/api', apiRoutes);

// A simple root endpoint
app.get('/', (req: Request, res: Response) => {
    res.send('LeadSarv Server is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
