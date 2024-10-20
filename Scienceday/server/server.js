// server.js
import express from 'express';
import bodyParser from 'body-parser';   
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import routes from './routes/index.js'; // Importing routes

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies

// Use the routes defined in routes.js
app.use('/api', routes);

// Global error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const startServer = async () => {
    try {
        await prisma.$connect(); // Connect to the database
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
};

startServer();
