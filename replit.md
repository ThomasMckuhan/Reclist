# Reclist - Social Media Platform for Content Recommendations

## Overview

Reclist is a social media platform where users can create ranked lists of their favorite media items (songs, books, movies, TV shows, YouTube videos, games, and art) along with personal stories explaining their choices. The platform emphasizes discovery through shared interests and meaningful connections between users who have similar tastes.

## Recent Changes

**July 19, 2025** - Communities Feature Complete & Deployment Ready:
- ✅ Added comprehensive Communities system with join/leave functionality
- ✅ Implemented community creation with custom colors and media type focus
- ✅ Added navigation links throughout the app for seamless user experience
- ✅ Verified all routing works correctly for deployment (all routes return 200 status)
- ✅ Successfully tested all major user flows: Home → Communities → Profile → User Profiles
- ✅ Build process completed without errors, ready for production deployment
- ✅ Updated trending stories with relevant media type icons (music notes, books, films, etc.)
- ✅ Added About Us page with platform description and feature highlights
- ✅ Each media type now has distinctive color-coded gradient backgrounds

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

This is a full-stack web application built with a modern React frontend and Express.js backend, using PostgreSQL for data persistence. The architecture follows a traditional client-server pattern with RESTful API communication.

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM
- **API Style**: RESTful API endpoints
- **Development**: Hot module replacement with Vite integration

## Key Components

### Database Schema
The application uses five main database tables:
- **users**: User profiles with username, email, display name, bio, location, and avatar color
- **mediaItems**: User-created media entries with title, creator, type, story, position (1-10 ranking), and engagement metrics
- **comments**: User comments on media items with content and timestamps
- **connections**: User-to-user relationships with pending/accepted status
- **likes**: User likes on media items

### Frontend Components
- **Navigation**: Top navigation bar with search functionality and user menu
- **MediaCard**: Individual media item display with interaction buttons
- **UserCard**: User profile cards showing shared interests and connection options
- **AddMediaDialog**: Modal form for creating new media entries
- **CommentModal**: Modal for viewing and adding comments to media items

### API Endpoints
- User management (CRUD operations for users)
- Media item management (create, read, update, delete media entries)
- Comment system (add/view comments on media items)
- Social features (connections between users, likes on content)
- Discovery features (finding users with similar interests)

## Data Flow

1. **User Authentication**: Currently uses mock user ID (1) for development
2. **Content Creation**: Users create ranked lists of media items with personal stories
3. **Social Discovery**: System matches users based on shared media items
4. **Engagement**: Users can like media items and comment on them
5. **Connections**: Users can send and accept connection requests

The frontend communicates with the backend through a centralized query client that handles API requests, caching, and error handling.

## External Dependencies

### Frontend Dependencies
- **UI Components**: Extensive use of Radix UI primitives for accessible components
- **Form Handling**: React Hook Form with Zod validation
- **Date Utilities**: date-fns for date formatting
- **Icons**: Lucide React for consistent iconography

### Backend Dependencies
- **Database**: Neon Database (serverless PostgreSQL)
- **ORM**: Drizzle ORM with Zod integration for type-safe database operations
- **Session Management**: PostgreSQL session store with connect-pg-simple

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Fast bundling for production backend
- **Replit Integration**: Development tooling for Replit environment

## Deployment Strategy

The application is designed for deployment on platforms that support Node.js:

### Build Process
1. **Frontend**: Vite builds the React application to static assets
2. **Backend**: ESBuild bundles the Express server for production
3. **Database**: Drizzle migrations handle schema updates

### Environment Configuration
- **Development**: Uses Vite dev server with HMR and proxy to Express backend
- **Production**: Express serves static frontend assets and API endpoints
- **Database**: Requires `DATABASE_URL` environment variable for PostgreSQL connection

The architecture supports both development and production environments with proper asset serving, API routing, and database connectivity. The modular structure allows for easy scaling and maintenance of individual components.