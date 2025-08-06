import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

interface Config {
    nodeEnv: string;
    port: number;
    database: {
        host: string;
        port: number;
        user: string;
        password: string | undefined;
        database: string;
        connectionLimit: number;
    };
    karma: {
        apiKey: string;
        baseUrl: string;
    };
    cors: {
        origin: string | string[];
        credentials: boolean;
    };
    rateLimit: {
        windowMs: number;
        maxRequests: number;
    };

    logging: {
        level: string;
        file: string;
    };
}

const requiredEnvVars = [
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME'
];

// Check for required environment variables
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

export const config: Config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3003', 10),
    
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        user: process.env.DB_USER || 'wallet_user',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'wallet_service_dev',
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10)
    },
  
    karma: {
        apiKey: process.env.KARMA_API_KEY || '',
        baseUrl: process.env.KARMA_BASE_URL || 'https://adjutor.lendsqr.com/v2'
    },
  
    cors: {
        origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
        credentials: process.env.CORS_CREDENTIALS === 'true'
    },
  
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10)
    },
    
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        file: process.env.LOG_FILE || path.join(process.cwd(), 'logs', 'app.log')
    }
};