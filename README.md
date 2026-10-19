# NexusTeam Portfolio Platform

A comprehensive, secure, full-stack portfolio platform where creatives can showcase their work, discover talent, and connect with opportunities.

## 🎯 Overview

NexusTeam is a professional portfolio platform built for:
- **Designers, developers, photographers, and creatives** to showcase their work
- **Freelancers and professionals** to build their online presence
- **Companies and recruiters** to discover talent
- **Platform administrators** to manage and moderate content

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Framer Motion for animations
- Recharts for data visualization
- Lucide React for icons

**Backend:**
- Node.js with Express.js
- SQLite database (better-sqlite3)
- JWT authentication
- bcrypt for password hashing
- Multer for file uploads
- Helmet for security headers
- Express-rate-limit for rate limiting
- Express-validator for input validation

### System Architecture

```
┌─────────────────┐
│   Frontend      │  React + TypeScript (Port 3000)
│   (User App)    │
└────────┬────────┘
         │
         │ HTTP/REST API
         │
┌────────▼────────┐
│   Backend API   │  Express.js (Port 4000)
│   (Shared)      │
└────────┬────────┘
         │
         │ SQL Queries
         │
┌────────▼────────┐
│   Database      │  SQLite
│   (Persistent)  │
└─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd portfolio-platform
```

2. **Install dependencies**
```bash
# Frontend dependencies are already installed
# Backend dependencies are in server/package.json
cd server
npm install
cd ..
```

3. **Configure environment**
```bash
# Copy example environment file
cp .env.example .env

# Edit .env and configure:
# - JWT_SECRET (change to a secure random string)
# - FRONTEND_URL (default: http://localhost:3000)
# - PORT (default: 4000)
```

4. **Setup database**
```bash
cd server
npm run setup
cd ..
```

This will:
- Initialize the SQLite database
- Create all tables and indexes
- Seed the database with test data

5. **Start the applications**

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Backend will run on http://localhost:4000

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend will run on http://localhost:3000

6. **Access the platform**
- User Application: http://localhost:3000
- API Health Check: http://localhost:4000/api/health

## 🔐 Test Accounts

After running the setup script, the following accounts are available:

### Administrator
- **Email:** admin@nexusteam.com
- **Password:** Admin@123456
- **Access:** Full admin dashboard at http://localhost:3000/admin

### Regular Users
All users have password: **User@123456**

1. **Alex Rivera** (Full Stack Developer)
   - Email: alex@example.com
   - Portfolio: Web Development

2. **Maya Patel** (UI/UX Designer)
   - Email: maya@example.com
   - Portfolio: Design

3. **James Chen** (Data Scientist)
   - Email: james@example.com
   - Portfolio: Data Science

4. **Sofia Martinez** (Interior Designer)
   - Email: sofia@example.com
   - Portfolio: Interior Design

5. **Ryan O'Brien** (DevOps Engineer)
   - Email: ryan@example.com
   - Portfolio: DevOps

⚠️ **IMPORTANT:** Change default passwords after first login!

## 📁 Project Structure

```
portfolio-platform/
├── server/                    # Backend API
│   ├── db/
│   │   ├── database.js       # Database connection
│   │   ├── schema.sql        # Database schema
│   │   └── seed.js           # Seed data
│   ├── middleware/
│   │   ├── auth.js           # Authentication & authorization
│   │   └── validation.js     # Input validation
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── users.js          # User management
│   │   ├── portfolios.js     # Portfolio CRUD
│   │   ├── projects.js       # Project CRUD
│   │   ├── admin.js          # Admin operations
│   │   └── upload.js         # File uploads
│   ├── index.js              # Express server
│   ├── setup.js              # Database setup script
│   └── package.json          # Backend dependencies
│
├── src/                       # Frontend React app
│   ├── components/           # Reusable components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── BottomBar.tsx
│   ├── context/              # React contexts
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── LanguageContext.tsx
│   ├── pages/                # Page components
│   │   ├── Home.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Team.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── CompanyPortal.tsx
│   ├── services/             # Business logic
│   │   ├── LoggingService.ts
│   │   └── SecurityService.ts
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
│
├── uploads/                   # Uploaded files (created at runtime)
├── .env                       # Environment variables (not in git)
├── .env.example              # Environment template
├── package.json              # Frontend dependencies
├── vite.config.js            # Vite configuration
└── README.md                 # This file
```

## 🔌 API Documentation

### Base URL
```
http://localhost:4000/api
```

### Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout (requires auth)
- `GET /auth/me` - Get current user (requires auth)
- `POST /auth/change-password` - Change password (requires auth)

#### Users
- `GET /users/:id` - Get public user profile
- `GET /users/me/profile` - Get own profile (requires auth)
- `PUT /users/me/profile` - Update profile (requires auth)
- `POST /users/me/skills` - Add skill (requires auth)
- `PUT /users/me/skills/:skillId` - Update skill (requires auth)
- `DELETE /users/me/skills/:skillId` - Delete skill (requires auth)
- `POST /users/me/experience` - Add experience (requires auth)
- `PUT /users/me/experience/:experienceId` - Update experience (requires auth)
- `DELETE /users/me/experience/:experienceId` - Delete experience (requires auth)
- `POST /users/me/deactivate` - Deactivate account (requires auth)

#### Portfolios
- `GET /portfolios` - Get all published portfolios (public)
- `GET /portfolios/slug/:slug` - Get portfolio by slug (public)
- `GET /portfolios/my` - Get own portfolios (requires auth)
- `GET /portfolios/:id` - Get portfolio by ID (requires auth, owner or admin)
- `POST /portfolios` - Create portfolio (requires auth)
- `PUT /portfolios/:id` - Update portfolio (requires auth, owner or admin)
- `DELETE /portfolios/:id` - Delete portfolio (requires auth, owner or admin)
- `GET /portfolios/meta/categories` - Get categories (public)

#### Projects
- `GET /projects/portfolio/:portfolioId` - Get projects for portfolio
- `GET /projects/:id` - Get project by ID
- `POST /projects/portfolio/:portfolioId` - Create project (requires auth)
- `PUT /projects/:id` - Update project (requires auth)
- `PUT /projects/portfolio/:portfolioId/reorder` - Reorder projects (requires auth)
- `DELETE /projects/:id` - Delete project (requires auth)

#### File Uploads
- `POST /upload/profile-picture` - Upload profile picture (requires auth)
- `POST /upload/portfolio-cover/:portfolioId` - Upload portfolio cover (requires auth)
- `POST /upload/project-image/:projectId` - Upload project image (requires auth)

#### Admin (requires admin role)
- `GET /admin/stats` - Get dashboard statistics
- `GET /admin/users` - Get all users
- `GET /admin/users/:id` - Get user details
- `PUT /admin/users/:id` - Update user (activate/deactivate, change role)
- `GET /admin/portfolios` - Get all portfolios
- `PUT /admin/portfolios/:id` - Update portfolio (feature/publish)
- `DELETE /admin/portfolios/:id` - Delete portfolio
- `GET /admin/audit-logs` - Get audit logs
- `GET /admin/categories` - Get categories

### Query Parameters

**Search & Filter:**
- `q` - Search query
- `category` - Filter by category
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `sort` - Sort order (recent, popular, featured)

**Example:**
```
GET /api/portfolios?q=react&category=web-development&page=1&limit=20&sort=popular
```

## 🛡️ Security Features

### Authentication & Authorization
- ✅ JWT-based authentication with secure token storage
- ✅ Password hashing with bcrypt (12 salt rounds)
- ✅ Role-based access control (user, admin)
- ✅ Server-side authorization on all protected endpoints
- ✅ Ownership verification for resource access
- ✅ Session management with expiration
- ✅ Secure logout with session invalidation

### Input Validation & Sanitization
- ✅ Express-validator for all inputs
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS prevention (output encoding)
- ✅ File upload validation (type, size)
- ✅ Rate limiting on sensitive endpoints

### Security Headers
- ✅ Helmet.js for security headers
- ✅ Content Security Policy
- ✅ CORS configuration
- ✅ Secure cookie settings

### File Upload Security
- ✅ File type validation (images only)
- ✅ File size limits (5MB)
- ✅ Secure file naming (UUID)
- ✅ Storage outside web root
- ✅ Old file cleanup on replacement

### Rate Limiting
- ✅ General API: 100 requests per 15 minutes
- ✅ Authentication: 5 requests per 15 minutes
- ✅ Configurable via environment variables

### Audit Logging
- ✅ All authentication events logged
- ✅ All admin actions logged
- ✅ All resource modifications logged
- ✅ IP address and user agent tracking
- ✅ Viewable in admin dashboard

## 🧪 Testing

### Manual Testing Checklist

#### Public Features
- [ ] View homepage
- [ ] Browse portfolios
- [ ] Search portfolios
- [ ] Filter by category
- [ ] View portfolio details
- [ ] View user profiles
- [ ] Responsive design (mobile/tablet/desktop)

#### User Authentication
- [ ] Register new account
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should fail)
- [ ] Logout
- [ ] Change password
- [ ] Session persistence

#### Portfolio Management
- [ ] Create portfolio
- [ ] Edit portfolio
- [ ] Publish/unpublish portfolio
- [ ] Delete portfolio
- [ ] Add projects
- [ ] Edit projects
- [ ] Delete projects
- [ ] Upload images
- [ ] View own portfolios

#### Authorization Tests
- [ ] User cannot access admin routes
- [ ] User cannot edit other user's portfolio
- [ ] User cannot delete other user's portfolio
- [ ] Unpublished portfolio not visible to public
- [ ] Admin can access all portfolios
- [ ] Admin can manage users

#### Admin Features
- [ ] Admin login
- [ ] View dashboard statistics
- [ ] View all users
- [ ] Activate/deactivate users
- [ ] View all portfolios
- [ ] Feature portfolios
- [ ] Delete portfolios
- [ ] View audit logs

#### Security Tests
- [ ] Rate limiting works
- [ ] Invalid JWT rejected
- [ ] Expired JWT rejected
- [ ] File upload size limit enforced
- [ ] File type validation works
- [ ] SQL injection attempts blocked
- [ ] XSS attempts blocked

### API Testing with cURL

**Register:**
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123456","name":"Test User"}'
```

**Login:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123456"}'
```

**Get Portfolios:**
```bash
curl http://localhost:4000/api/portfolios
```

**Create Portfolio (requires token):**
```bash
curl -X POST http://localhost:4000/api/portfolios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"My Portfolio","description":"Test portfolio","category":"web-development"}'
```

## 📊 Database Schema

### Core Tables

**users** - User accounts and profiles
**portfolios** - Portfolio metadata
**projects** - Individual projects within portfolios
**skills** - User skills
**experience** - Work experience
**education** - Educational background
**favorites** - Saved portfolios
**sessions** - Active user sessions
**audit_logs** - System audit trail
**categories** - Portfolio categories
**reports** - Content moderation reports

### Relationships
- Users have many portfolios
- Portfolios have many projects
- Users have many skills, experience, education
- Users can favorite many portfolios
- All changes logged in audit_logs

## 🌍 Internationalization

The platform supports 5 languages:
- English (en)
- Chinese (zh)
- Spanish (es)
- Hindi (hi)
- Arabic (ar) - with RTL support

Language can be changed via the bottom bar language selector.

## 🎨 Theming

The platform supports dark and light modes:
- Theme preference saved in localStorage
- Toggle available in bottom bar
- Smooth transitions between themes
- All components theme-aware

## 📝 Environment Variables

See `.env.example` for all available configuration options.

**Required:**
- `JWT_SECRET` - Secret key for JWT signing (use a strong random string)
- `FRONTEND_URL` - Frontend URL for CORS

**Optional:**
- `PORT` - Backend port (default: 4000)
- `NODE_ENV` - Environment (development/production)
- `DB_PATH` - Database file path
- `JWT_EXPIRES_IN` - Token expiration time

## 🚢 Deployment

### Production Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Set NODE_ENV=production
- [ ] Configure proper CORS origins
- [ ] Enable HTTPS
- [ ] Set up reverse proxy (nginx/Apache)
- [ ] Configure production database
- [ ] Set up file storage (S3 or similar)
- [ ] Configure email service for notifications
- [ ] Set up monitoring and logging
- [ ] Configure backups
- [ ] Run security audit
- [ ] Test all features in production environment
- [ ] Change all default passwords

### Recommended Hosting

**Frontend:**
- Vercel
- Netlify
- AWS S3 + CloudFront

**Backend:**
- Railway
- Render
- AWS EC2
- DigitalOcean

**Database:**
- For production, migrate from SQLite to PostgreSQL
- Use managed database services (RDS, PlanetScale, etc.)

## 🔧 Development

### Available Scripts

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

**Backend:**
```bash
cd server
npm run dev          # Start with auto-reload
npm run setup        # Initialize database
npm start            # Start production server
```

### Code Style

- TypeScript for type safety
- ESLint for linting (configure as needed)
- Prettier for formatting (configure as needed)
- Component-based architecture
- Modular route structure

## 🐛 Troubleshooting

### Database locked error
```bash
# Close all connections and restart
cd server
rm db/portfolio.db
npm run setup
```

### Port already in use
```bash
# Change PORT in .env file
# Or kill the process using the port
```

### CORS errors
```bash
# Check FRONTEND_URL in .env matches your frontend URL
# Ensure backend is running on correct port
```

### Upload errors
```bash
# Ensure uploads/ directory exists and is writable
# Check file size limits
# Verify file types are allowed
```

## 📄 License

This project is proprietary software.

## 🤝 Contributing

This is a demonstration project. For production use, implement proper contribution guidelines.

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review API documentation
- Check audit logs for errors
- Review browser console for frontend errors

## ✅ Definition of Done

This platform is complete when:
- [x] Frontend and backend are fully integrated
- [x] All CRUD operations work correctly
- [x] Authentication and authorization are secure
- [x] File uploads work with validation
- [x] Admin dashboard is functional
- [x] Search and filtering work
- [x] Responsive design is implemented
- [x] Dark/light theme support
- [x] Multi-language support
- [x] Audit logging is active
- [x] Rate limiting is configured
- [x] Security headers are set
- [x] Input validation is comprehensive
- [x] Error handling is robust
- [x] Documentation is complete

## 🎉 Summary

NexusTeam Portfolio Platform is a production-ready, secure, full-stack application that provides:

✅ **Complete user experience** - Registration, authentication, portfolio management
✅ **Robust admin system** - User management, content moderation, analytics
✅ **Enterprise security** - JWT auth, RBAC, rate limiting, audit logs
✅ **Modern tech stack** - React, TypeScript, Express, SQLite
✅ **Professional design** - Responsive, accessible, themeable
✅ **Internationalization** - 5 languages with RTL support
✅ **File management** - Secure uploads with validation
✅ **Search & discovery** - Full-text search with filtering
✅ **Comprehensive documentation** - Setup, API, security, deployment

The platform is ready for deployment after completing the production checklist and migrating to a production-grade database.
