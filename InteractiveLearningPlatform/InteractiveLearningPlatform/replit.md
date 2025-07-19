# replit.md

## Overview

SkillRoad is an AI-powered learning roadmap web application that helps students identify, learn, and master job-relevant skills by generating personalized learning paths. The application analyzes real job requirements and creates step-by-step learning roadmaps with curated YouTube resources and AI-generated assessments.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

This is a full-stack web application built with a modern TypeScript stack:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query (React Query) for server state
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Style**: RESTful APIs with structured route handling
- **Authentication**: Replit Auth with OpenID Connect (OIDC)
- **AI Integration**: Google Gemini 2.5 Pro for roadmap generation and content creation

### Database & ORM
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Migrations**: Drizzle Kit for schema management
- **Connection**: WebSocket-enabled connection pooling for serverless deployment

## Key Components

### Authentication System
- Replit Auth integration with mandatory session storage
- JWT-based user authentication with OpenID Connect
- Session management using PostgreSQL store
- Protected routes with authentication middleware

### AI Services
- **Roadmap Generation**: Creates personalized learning paths based on job role and experience level
- **Assessment Creation**: Generates quiz questions and mock interview content
- **Resource Recommendations**: Curates YouTube videos and learning materials

### Data Models
- **Users**: Profile management with Replit Auth integration
- **Roadmaps**: Learning path containers with metadata
- **Modules**: Individual learning units within roadmaps
- **Resources**: Curated learning materials (videos, articles, documentation)
- **Assessments**: AI-generated quizzes and evaluations
- **User Progress**: Tracking completion status and scores

### Frontend Components
- **Landing Page**: Unauthenticated homepage with feature showcase
- **Dashboard**: Main application interface for roadmap management
- **Module Cards**: Interactive learning unit displays with progress tracking
- **Assessment Modal**: In-app quiz interface with timer and scoring
- **Resource Modal**: Curated content browser with external links

## Data Flow

1. **User Authentication**: Replit Auth handles login/logout flows
2. **Roadmap Creation**: User inputs job role → AI generates structured learning path
3. **Content Curation**: AI recommends resources → System stores metadata and links
4. **Progress Tracking**: User interactions update completion status in database
5. **Assessment Flow**: AI generates questions → User takes quiz → Results stored

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **@google/genai**: AI content generation (Gemini 2.5 Pro model)
- **@tanstack/react-query**: Client-side data fetching and caching
- **drizzle-orm**: Type-safe database operations
- **express**: Web server framework

### UI Libraries
- **@radix-ui/***: Accessible component primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **wouter**: Lightweight routing

### Development Tools
- **vite**: Build tool and development server
- **tsx**: TypeScript execution
- **@replit/vite-plugin-***: Replit-specific development tools

## Deployment Strategy

### Development Environment
- Vite development server with HMR (Hot Module Replacement)
- TypeScript compilation with strict type checking
- Environment variable configuration for database and API keys

### Production Build
- Vite builds frontend assets to `dist/public`
- esbuild bundles backend server to `dist/index.js`
- ES modules with external package bundling for Node.js deployment

### Database Management
- Drizzle migrations in `migrations/` directory
- Schema definitions in `shared/schema.ts`
- Push-based deployment with `drizzle-kit push`

### Environment Requirements
- `DATABASE_URL`: PostgreSQL connection string
- `GEMINI_API_KEY`: Google Gemini API access token
- `SESSION_SECRET`: Session encryption key
- `REPL_ID`: Replit environment identifier

The application follows a monorepo structure with shared TypeScript types between client and server, enabling type safety across the full stack. The architecture prioritizes developer experience with hot reloading, comprehensive error handling, and modular component design.