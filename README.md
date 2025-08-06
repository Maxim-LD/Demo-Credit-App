# Demo Credit APP

A secure, production-ready wallet API built with Node.js, TypeScript, and MySQL, featuring Karma blacklist integration for enhanced security.

## Features

- ✅ User registration and authentication
- ✅ JWT-based security
- ✅ Wallet account management
- ✅ Fund wallet, transfer, and withdraw operations
- ✅ Transaction history and balance tracking
- ✅ Karma blacklist integration
- ✅ Rate limiting and security middleware
- ✅ Comprehensive error handling
- ✅ Audit logging
- ✅ Input validation and sanitization
- ✅ Database migrations and seeders
- ✅ Docker support
- ✅ Comprehensive testing

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MySQL 8.0
- **ORM**: Knex.js
- **Authentication**: JSON Web Tokens
- **Validation**: Joi
- **Logging**: Winston
- **Testing**: Jest
- **Containerization**: Docker & Docker Compose

## Quick Start

### Prerequisites

- Node.js 18 or higher
- MySQL 8.0
- Redis (optional, for advanced features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/demo-credit-app.git
cd demo-wallet-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run database migrations:
```bash
npm run migrate
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Using Docker

1. Build and run with Docker Compose:
```bash
docker-compose up -d
```

This will start:
- API server on port 3000
- MySQL database on port 3306
- Redis on port 6379
- Nginx reverse proxy on ports 80/443

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get user profile (protected)

### Wallet Operations
- `POST /api/v1/wallet/fund` - Fund wallet
- `POST /api/v1/wallet/transfer` - Transfer funds
- `POST /api/v1/wallet/withdraw` - Withdraw funds
- `GET /api/v1/wallet/balance` - Get wallet balance
- `GET /api/v1/wallet/transactions` - Get transaction history

### Health Check
- `GET /api/v1/health` - API health status

## API Documentation

### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+2348012345678",
  "bvn": "12345678901",
  "address": "123 Main St, Lagos"
}
```

### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Fund Wallet
```http
POST /api/v1/wallet/fund
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 10000.00,
  "description": "Wallet funding"
}
```

### Transfer Funds
```http
POST /api/v1/wallet/transfer
Authorization: Bearer <token>
Content-Type: application/json

{
  "recipientAccountNumber": "2501234567",
  "amount": 5000.00,
  "description": "Transfer to friend"
}
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **Input Validation**: Comprehensive request validation
- **Karma Integration**: Real-time blacklist checking
- **Audit Logging**: Complete audit trail
- **Encryption**: Sensitive data encryption
- **CORS Protection**: Configurable CORS policies
- **Helmet Security**: Security headers middleware

## Database Schema

The application uses the following main tables:
- `users` - User account information
- `accounts` - Wallet account details
- `transactions` - Transaction records
- `audit_logs` - Audit trail (optional)

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Deployment

### Production Deployment

1. Build the application:
```bash
npm run build
```

2. Set production environment variables
3. Run database migrations:
```bash
npm run migrate
```

4. Start the application:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.