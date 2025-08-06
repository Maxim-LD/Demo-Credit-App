import { config } from '../config/index';
import logger from '../utils/logger';
import mysql from 'mysql2/promise'

export class DatabaseConnection {
    private static instance: DatabaseConnection;
    private pool: mysql.Pool | null = null;

    private constructor() {}

    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }

    public async connect(): Promise<void> {
        try {
            this.pool = mysql.createPool({
                host: config.database.host,
                port: config.database.port,
                user: config.database.user,
                password: config.database.password,
                database: config.database.database,
                connectionLimit: config.database.connectionLimit,
                // acquireTimeout: 60000,
                // timeout: 60000,
                // reconnect: true,
                charset: 'utf8mb4',
                timezone: '+00:00',
                dateStrings: false
            });

            // Test the connection
            const connection = await this.pool.getConnection();
            await connection.ping();
            connection.release();
            logger.info('Database connection established successfully');
        } catch (error) {
            logger.error('Failed to connect to database:', error);
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        try {
            if (this.pool) {
                await this.pool.end();
                this.pool = null;
                logger.info('Database connection closed');
            }
        } catch (error) {
            logger.error('Error closing database connection:', error);
            throw error;
        }
    }

    public getPool(): mysql.Pool {
        if (!this.pool) {
            throw new Error('Database connection not established. Call connect() first.');
        }
        return this.pool;
    }

    public async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
        if (!this.pool) {
            throw new Error('Database connection not established');
        }

        try {
            const [rows] = await this.pool.execute(sql, params);
            return rows as T[];
        } catch (error) {
            logger.error('Database query error:', { sql, params, error });
            throw error;
        }
    }

    public async transaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> {
        if (!this.pool) {
            throw new Error('Database connection not established');
        }

        const connection = await this.pool.getConnection();
        
        try {
            await connection.beginTransaction();
            const result = await callback(connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    public async healthCheck(): Promise<boolean> {
        try {
            if (!this.pool) {
                return false;
            }
            const connection = await this.pool.getConnection();
            await connection.ping();
            connection.release();
            return true;
        } catch (error) {
            logger.error('Database health check failed:', error);
            return false;
        }
    }
}