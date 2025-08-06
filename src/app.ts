import express from 'express'
import helmet from 'helmet';
import cors from 'cors'
import morgan from 'morgan'
import compression from 'compression';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import logger from './utils/logger';
import router from './routes';
import authRouter from './routes/auth';
import { config } from './config/index';
import { globalRateLimit } from './middleware/rateLimiter';

const app = express()

// Trust proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

app.use(cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request parsing middleware
app.use(express.json({ limit: '10mb' }));

// Compression
app.use(compression());

// Logging
app.use(morgan('combined', {
    stream: {
        write: (message: string) => logger.info(message.trim())
    }
}));

// Rate limiting
app.use(globalRateLimit);

// API routes
app.use('/api/v1', router);
app.use('/api/v1', authRouter)

// // Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;