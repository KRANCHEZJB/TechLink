# 🚀 TechLink Project Schema

## 🗄️ DATABASE SCHEMA

### User Table
- `id` (UUID) - Primary key
- `email` (String, Unique) - User email
- `name` (String, Optional) - User name
- `role` (String) - User role (volunteer/admin)
- `hashedPass` (String) - Hashed password
- `createdAt` (DateTime) - Account creation date

### Organization Table  
- `id` (UUID) - Primary key
- `name` (String) - Organization name
- `verified` (Boolean) - Verification status
- `description` (String, Optional) - Organization description
- `createdAt` (DateTime) - Creation date

### Event Table
- `id` (UUID) - Primary key
- `orgId` (String) - Foreign key to Organization
- `title` (String) - Event title
- `description` (String, Optional) - Event description
- `sdgGoal` (String, Optional) - Sustainable Development Goal
- `startAt` (DateTime) - Event start time
- `endAt` (DateTime, Optional) - Event end time
- `location` (JSON, Optional) - Event location data
- `capacity` (Int, Optional) - Maximum attendees
- `createdAt` (DateTime) - Creation date

### Registration Table
- `id` (UUID) - Primary key
- `userId` (String) - Foreign key to User
- `eventId` (String) - Foreign key to Event
- `status` (String) - Registration status
- `createdAt` (DateTime) - Registration date

## 🌐 API ENDPOINTS

### Users
- `POST   /api/v1/users` - Create user
- `GET    /api/v1/users` - Get all users  
- `GET    /api/v1/users/:id` - Get user by ID
- `PATCH  /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Authentication
- `POST   /api/v1/auth/register` - Register user
- `POST   /api/v1/auth/login` - Login user
- `GET    /api/v1/auth/profile` - Get profile (JWT protected)

### System
- `GET    /api/v1/` - Welcome message
- `GET    /api/v1/health` - Health check

## 🛠️ TECH STACK

- **Backend**: NestJS + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + Passport
- **Security**: bcrypt password hashing
- **Containerization**: Docker + Docker Compose

## 📈 CURRENT STATUS: 50% Complete
✅ Users Module | ✅ Authentication | 🚧 Organizations | 🚧 Events | 🚧 Registrations
