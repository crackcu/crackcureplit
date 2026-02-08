# Crack-CU - Chittagong University Admission Prep Platform

## Overview
Crack-CU is a mobile-responsive ed-tech platform for Chittagong University admission preparation. The tagline is "Don't Just Study, Crack It!". Brand colors: primary red (#eb202a), success green (#059669).

## Recent Changes
- Feb 2026: Initial build - full-stack app with auth, courses, mock tests, classes, resources, notices, contact, admin dashboard
- Database schema: 11 tables via Drizzle ORM + PostgreSQL
- Object storage integrated for file uploads (GCS)
- Session-based auth with bcrypt password hashing
- SMTP email via Gmail (crack.info@gmail.com)

## Architecture
- **Frontend**: React + Vite, wouter routing, TanStack Query v5, shadcn/ui, Tailwind CSS, framer-motion
- **Backend**: Express.js, Drizzle ORM, PostgreSQL, express-session with connect-pg-simple
- **Auth**: Custom auth, username auto-generated: [HSC Group Letter][HSC Year Last 2 Digits][HSC Roll]
- **Roles**: student, mentor, moderator, admin

## Key Files
- `shared/schema.ts` - All data models, insert schemas, types
- `server/routes.ts` - All API routes (public, auth, admin)
- `server/storage.ts` - DatabaseStorage class with all CRUD methods
- `server/auth.ts` - Session setup with pg-simple store
- `client/src/App.tsx` - Main app with lazy-loaded routes
- `client/src/hooks/use-auth.tsx` - Auth context/provider
- `client/src/components/header.tsx` - Responsive header with nav
- `client/src/components/footer.tsx` - Footer with social links

## Pages
- Home (hero carousel, 5 content sections)
- Courses, Mock Tests, Classes, Resources, Notices (list pages with filters)
- Contact (form + team profiles)
- Auth (login/register with HSC/SSC info)
- Dashboard (student profile, submissions, enrollments)
- Admin (tabbed panel: users, courses, mock tests, classes, resources, notices, banners, team)

## User Preferences
- Mobile-first design priority
- Bangladesh education context (boards, HSC/SSC groups)
- SMTP: crack.info@gmail.com / app password: nuon lxjf ntvm ylin
- Mock test marking: EngP(+2/-0.5,pass13), EngO(+1/-0.25), AS(+2/-0.5,pass10), PS(+2/-0.5,pass10), overall pass 40, -3 penalty for second-timers

## Database Tables
users, heroBanners, courses, mockTests, mockSubmissions, classes, resources, notices, teamMembers, enrollments, siteSettings
