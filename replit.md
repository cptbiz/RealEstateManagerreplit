# RealEstate CRM - Project Documentation

## Overview

This is a full-stack Real Estate CRM application built with a modern tech stack. It's designed to help real estate professionals manage leads, properties, contacts, appointments, tasks, and documents all in one place. The application uses a client-server architecture with React on the frontend and Express.js on the backend, with PostgreSQL as the database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with custom styling
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error handling middleware

## Key Components

### Database Schema
The application uses the following main entities:
- **Users**: Store user profile information from Replit Auth
- **Leads**: Potential customers with contact info and status tracking
- **Properties**: Real estate listings with detailed information
- **Contacts**: Business contacts (clients, vendors, partners)
- **Appointments**: Scheduled meetings and property showings
- **Tasks**: To-do items with priorities and due dates
- **Documents**: File storage references and metadata
- **Activities**: System activity tracking for audit trails

### Authentication System
- Uses Replit's OpenID Connect for user authentication
- Session-based authentication with PostgreSQL session store
- Automatic user profile creation and updates
- Protected routes with authentication middleware

### Frontend Features
- **Dashboard**: Overview with stats and recent activity
- **Lead Management**: Full CRUD operations for leads
- **Property Management**: Property listings with detailed information
- **Contact Management**: Business contact organization
- **Appointment Scheduling**: Calendar-based appointment system
- **Task Management**: Priority-based task tracking
- **Document Management**: File upload and organization
- **Reporting**: Analytics and business insights

## Data Flow

1. **Authentication Flow**:
   - User authenticates via Replit Auth
   - Session created and stored in PostgreSQL
   - User profile synced with local database

2. **API Request Flow**:
   - Frontend makes authenticated requests to `/api/*` endpoints
   - Express middleware validates session
   - Controllers interact with database via Drizzle ORM
   - JSON responses sent back to frontend

3. **State Management**:
   - TanStack Query manages server state and caching
   - Form state handled by React Hook Form
   - UI state managed by React's built-in state

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL database
- **Drizzle ORM**: Type-safe database access
- **Database URL**: Required environment variable

### Authentication
- **Replit Auth**: OpenID Connect provider
- **Session Secret**: Required for session encryption
- **Replit Domains**: Required for OAuth configuration

### Railway Deployment
- **Railway Platform**: Cloud deployment platform
- **Embedded Configuration**: All environment variables embedded in code
- **PostgreSQL Service**: Railway-hosted database
- **Docker Support**: Containerized deployment

### Frontend Libraries
- **Radix UI**: Headless UI components
- **Tailwind CSS**: Utility-first CSS framework
- **TanStack Query**: Server state management
- **React Hook Form**: Form handling
- **Zod**: Schema validation
- **Date-fns**: Date manipulation
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety
- **ESBuild**: Fast bundling for production
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## Deployment Strategy

### Development
- Uses Vite dev server for frontend hot reloading
- Express server runs with tsx for TypeScript execution
- Database migrations handled by Drizzle Kit
- Environment variables for configuration

### Production Build
- Frontend built with Vite to static files
- Backend bundled with ESBuild for Node.js
- Static files served by Express
- Database schema pushed via Drizzle Kit

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `REPLIT_DOMAINS`: OAuth domains configuration
- `ISSUER_URL`: OpenID Connect issuer (optional, defaults to Replit)

The application is designed to be deployed on Replit but can be adapted for other hosting platforms with minimal configuration changes.

## Railway Deployment Ready

### Configuration Files
- `config/railway.js`: Embedded environment variables
- `railway.json`: Railway platform configuration
- `nixpacks.toml`: Build configuration
- `Dockerfile`: Docker containerization
- `start.sh`: Production startup script
- `railway-deploy.md`: Complete deployment guide

### Key Features for Railway
- All environment variables embedded in code
- No external configuration required
- Automatic database migration on startup
- Production-ready error handling
- CORS configuration for custom domains

### Deployment Process
1. Configure database URL in `config/railway.js`
2. Update domain settings for authentication
3. Deploy via GitHub or Railway CLI
4. Automatic build and deployment
5. Ready for production use