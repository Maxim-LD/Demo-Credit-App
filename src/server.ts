import app from "./app";
import { config } from "./config/index";
import { DatabaseConnection } from "./database/connection";
import logger from "./utils/logger";

const startServer = async (): Promise<void> => {
    try {
        // Initialize database connection
        const dbConnection = DatabaseConnection.getInstance();
        await dbConnection.connect();
        logger.info('Database connected successfully');

        // Start the server
        const server = app.listen(config.port, () => {
            logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
            logger.info(`API Documentation available at http://localhost:${config.port}/api/v1/health`);
        });

        // Graceful shutdown
        const shutdown = async (signal: string) => {
            logger.info(`${signal} received. Shutting down gracefully...`);
            
            server.close(async () => {
                logger.info('HTTP server closed');
                
                try {
                    await dbConnection.disconnect();
                    logger.info('Database connection closed');
                    process.exit(0);
                } catch (error) {
                    logger.error('Error during database shutdown:', error);
                    process.exit(1);
                }
            });
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

startServer();