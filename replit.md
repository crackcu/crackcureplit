# Crack-CU - Chittagong University Admission Prep Platform

## Overview
Crack-CU is a mobile-responsive ed-tech platform for Chittagong University admission preparation. The tagline is "Don't Just Study, Crack It!". Brand colors: primary red (#eb202a), success green (#059669).

## Recent Changes
- Feb 2026: Initial build - full-stack app with auth, courses, mock tests, classes, resources, notices, contact, admin dashboard
- Feb 2026: Added ImageUploader component (URL + file upload via object storage) across all admin image fields
- Feb 2026: Mock test visual question editor with per-question image upload and ID assigning
- Feb 2026: Bangladesh timezone (Asia/Dhaka) for mock scheduling and display
- Feb 2026: Mock test exam page with timer, grading engine, and result display
- Feb 2026: Email notifications on registration, mock submission, and contact form (via crackcu.info@gmail.com)
- Database schema: 11 tables via Drizzle ORM + PostgreSQL
- Object storage integrated for file uploads (GCS)
- Session-based auth with bcrypt password hashing

## Architecture
- **Frontend**: React + Vite, wouter routing, TanStack Query v5, shadcn/ui, Tailwind CSS, framer-motion
- **Backend**: Express.js, Drizzle ORM, PostgreSQL, express-session with connect-pg-simple
- **Auth**: Custom auth, username auto-generated: [HSC Group Letter][HSC Year Last 2 Digits][HSC Roll]
- **Roles**: student, mentor, moderator, admin
- **Email**: Nodemailer with Gmail SMTP (crackcu.info@gmail.com)
- **Object Storage**: GCS via Replit integration, presigned URL uploads

## Key Files
- `shared/schema.ts` - All data models, insert schemas, types
- `server/routes.ts` - All API routes (public, auth, admin, mock submission)
- `server/storage.ts` - DatabaseStorage class with all CRUD methods
- `server/auth.ts` - Session setup with pg-simple store
- `client/src/App.tsx` - Main app with lazy-loaded routes
- `client/src/hooks/use-auth.tsx` - Auth context/provider
- `client/src/components/header.tsx` - Responsive header with nav
- `client/src/components/footer.tsx` - Footer with social links
- `client/src/components/image-uploader.tsx` - Reusable image uploader (URL + file upload)
- `client/src/pages/mock-exam.tsx` - Mock test exam page with timer and grading

## Pages
- Home (hero carousel, 5 content sections)
- Courses, Mock Tests, Classes, Resources, Notices (list pages with filters)
- Mock Exam (/mock-tests/:id) - Full exam interface with timer, navigation, submission
- Contact (form + team profiles)
- Auth (login/register with HSC/SSC info)
- Dashboard (student profile, submissions, enrollments)
- Admin (tabbed panel: users, courses, mock tests, classes, resources, notices, banners, team)

## User Preferences
- Mobile-first design priority
- Bangladesh education context (boards, HSC/SSC groups)
- All times displayed in Bangladesh Standard Time (BST, UTC+6)
- SMTP: crackcu.info@gmail.com / app password stored in env vars
- Mock test marking: EngP(+2/-0.5,pass13), EngO(+1/-0.25), AS(+2/-0.5,pass10), PS(+2/-0.5,pass10), overall pass 40, -3 penalty for second-timers
- All image fields support both URL input and file upload

## Database Tables
users, heroBanners, courses, mockTests, mockSubmissions, classes, resources, notices, teamMembers, enrollments, siteSettings

## Mock Test Grading Rules
- EngP: +2 correct, -0.5 wrong, pass mark 13
- EngO: +1 correct, -0.25 wrong, no individual pass mark
- AS: +2 correct, -0.5 wrong, pass mark 10
- PS: +2 correct, -0.5 wrong, pass mark 10
- Overall pass mark: 40 (net marks)
- 2nd+ attempt penalty: -3 from total
- Unanswered questions: no marks deducted
