

# Open Lucius - Step 1: SaaS Foundation

## Overview
Building the core authentication and structure for Open Lucius, a multi-tenant AI website builder platform for healthcare professionals (doctors, dentists, pharmacists).

---

## 1. Landing Page
A modern, bold landing page with:
- **Hero Section**: Eye-catching headline about AI-powered websites for professionals, vibrant gradient background, and prominent "Get Started" CTA button
- **Features Section**: 3-4 feature cards highlighting key benefits (AI-powered, professional templates, easy management, instant hosting)
- **Header**: Logo + Login/Sign Up buttons
- **Modern & Bold aesthetic**: Gradients, vibrant colors, strong CTAs (similar to Durable.co style)

---

## 2. Authentication System
Full Supabase-backed authentication:
- **Auth Modal**: Combined login/signup modal (not separate pages) with smooth tab switching
- **Email & Password**: Standard registration and login
- **Google OAuth**: One-click Google sign-in
- **Apple OAuth**: One-click Apple sign-in
- **Session Management**: Persistent sessions with automatic token refresh
- **Protected Routes**: Dashboard only accessible when logged in
- **Auto-redirect**: Logged-in users automatically redirected to dashboard

> **Note**: Google and Apple OAuth will require configuration in your Supabase dashboard with respective OAuth credentials.

---

## 3. Database Structure
Two core tables in Supabase:

**users table** (extending auth.users):
- Uses Supabase's built-in auth.users (no separate profiles table for now)

**projects table**:
- `id` (UUID, primary key)
- `user_id` (UUID, references auth.users)
- `profession` (text - doctor, dentist, pharmacist, etc.)
- `status` (text - draft, published, etc.)
- `created_at` (timestamp)
- Row Level Security (RLS) enabled so users only see their own projects

---

## 4. Dashboard Page
Clean, welcoming dashboard for authenticated users:
- **Welcome Message**: Personalized greeting
- **Empty State**: "Create your first website" call-to-action button (no logic yet, just the UI)
- **Clean Layout**: Ready for future expansion (sidebar, project list, etc.)
- **Logout**: Easy way to sign out

---

## 5. App Structure
Production-ready folder organization:
- Proper routing with React Router
- Reusable components
- Auth context for session management
- Protected route wrapper
- Clean separation of concerns

---

## What's NOT Included (as requested)
- Website generation/AI features
- Forms or data collection
- Payment integration
- Analytics
- Templates or template selection

