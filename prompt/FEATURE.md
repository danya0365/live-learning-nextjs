# 🌍 World-Class System Prompt: Live Learning Platform
## Stack: Next.js 14 (App Router) + Supabase + TypeScript

---

## 📋 PROJECT OVERVIEW

You are an expert full-stack engineer specializing in real-time educational platforms. Build a **production-grade Live Learning Platform** using:

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS
- **Backend & DB**: Supabase (PostgreSQL, Realtime, Auth, Storage, Edge Functions)
- **Live Video**: Agora RTC SDK (or Daily.co as fallback)
- **Payments**: Stripe
- **State Management**: Zustand + React Query (TanStack Query v5)
- **Real-time**: Supabase Realtime (websockets/channels)

The platform must support **4 user roles**: `super_admin`, `instructor`, `student`, `org_admin` and serve **3 business models**: B2C (individual), B2B (organization), Bootcamp/Institution — simultaneously.

---

## 🗄️ DATABASE SCHEMA (Supabase PostgreSQL)

Design the following tables with full RLS (Row Level Security) policies:

### Core Tables
```sql
-- Users & Profiles
profiles (id, role, full_name, avatar_url, bio, timezone, language, created_at)
organizations (id, name, slug, logo_url, plan, seats_limit, owner_id, settings jsonb)
org_members (org_id, user_id, role, joined_at)

-- Courses & Content
courses (id, instructor_id, org_id, title, slug, description, thumbnail_url, 
         price, currency, category, level, language, status, is_live_only, 
         max_students, tags text[], seo_meta jsonb, created_at, published_at)
         
course_sections (id, course_id, title, order_index)
lessons (id, section_id, title, type[video|live|quiz|document], 
         content_url, duration_seconds, is_preview, order_index)

-- Live Sessions
live_sessions (id, course_id, instructor_id, title, description, 
               scheduled_at, started_at, ended_at, status[scheduled|live|ended|cancelled],
               recording_url, agora_channel, max_participants, 
               whiteboard_enabled, recording_enabled)

session_participants (session_id, user_id, joined_at, left_at, 
                      role[host|co_host|student|observer])

-- Enrollment & Progress
enrollments (id, course_id, user_id, org_id, enrolled_at, completed_at, 
             payment_id, access_type[purchased|subscription|org_seat|free])
             
lesson_progress (user_id, lesson_id, status[not_started|in_progress|completed], 
                 watch_time_seconds, last_position, completed_at)
                 
course_progress (user_id, course_id, progress_percent, last_activity_at)

-- Monetization
products (id, type[course|subscription_plan|bundle], course_id, 
          name, price, currency, billing_interval, stripe_price_id)
          
purchases (id, user_id, org_id, product_id, amount, currency, 
           status, stripe_payment_intent_id, created_at)
           
subscriptions (id, user_id, org_id, plan_id, status, 
               current_period_start, current_period_end, stripe_subscription_id)

-- Interaction & Engagement
chat_messages (id, session_id, course_id, user_id, content, type[text|question|poll|announcement], 
               is_pinned, parent_id, created_at)
               
reactions (session_id, user_id, type[👋|❤️|🔥|👏|😮], created_at)
polls (id, session_id, question, options jsonb, ends_at, is_active)
poll_responses (poll_id, user_id, option_index, created_at)
quizzes (id, lesson_id, title, pass_score)
quiz_questions (id, quiz_id, question, options jsonb, correct_index, explanation)
quiz_attempts (id, quiz_id, user_id, answers jsonb, score, passed, completed_at)

-- Certificates & Achievements
certificates (id, user_id, course_id, template_id, issued_at, 
              verification_code, metadata jsonb)
achievements (id, user_id, type, metadata jsonb, earned_at)

-- Reviews & Ratings
reviews (id, course_id, user_id, rating, comment, is_featured, created_at)

-- Notifications
notifications (id, user_id, type, title, body, data jsonb, read_at, created_at)
notification_preferences (user_id, channel[email|push|in_app], type, enabled)

-- Analytics
session_analytics (session_id, peak_participants, avg_watch_time, 
                   questions_asked, polls_created, recording_views)
course_analytics (course_id, date, enrollments, completions, revenue, 
                  avg_rating, active_students)
```

---

## ⚡ FEATURE MODULES

### 1. AUTHENTICATION & AUTHORIZATION
- Supabase Auth with: Email/Password, Google OAuth, GitHub OAuth, Magic Link
- Role-based access control (RBAC) enforced at both middleware and RLS level
- JWT custom claims for role injection
- Multi-tenant support: users can belong to multiple organizations
- SSO support for B2B organizations (SAML via Supabase)
- Session management with refresh token rotation
- 2FA support (TOTP)

### 2. COURSE MANAGEMENT (Instructor Dashboard)
- Rich course builder with drag-and-drop curriculum editor
- Section and lesson reordering (optimistic updates)
- Lesson types: video upload, live session link, quiz, downloadable resource, text/markdown
- Video upload directly to Supabase Storage → auto-generate thumbnail
- Course pricing: free, one-time, subscription-gated, org-bundle
- Drip content scheduling (release lessons on a schedule)
- Course cloning and template system
- SEO-friendly course pages with structured data (JSON-LD)
- Bulk import curriculum via CSV

### 3. LIVE SESSION ENGINE (Core Feature)
**Pre-session:**
- Schedule live sessions linked to a course or standalone
- Automated email reminders (24h, 1h, 10min before) via Resend
- Calendar integration (Google Calendar, Outlook .ics export)
- Waiting room with countdown timer

**In-session (Live Room):**
- Multi-participant HD video via Agora RTC (up to 300 participants)
- Host controls: mute all, spotlight speaker, remove participant
- Raise hand queue with notification sound
- Real-time chat with message types: text, question, announcement
- Message pinning and thread replies
- Emoji reactions with floating animations (🔥 👏 ❤️)
- Interactive whiteboard (Excalidraw embedded or Fabric.js)
- Screen sharing with annotation tools
- Live polls: create → vote → reveal results in real-time
- Breakout rooms (sub-channels in Agora)
- Co-instructor/co-host invitation
- Session recording (Agora Cloud Recording → store to Supabase Storage)
- Auto-transcription of recording (OpenAI Whisper API)
- Background blur and virtual backgrounds

**Post-session:**
- Recording available within 30 minutes
- AI-generated session summary and key points
- Auto-send recording link to all participants
- Session analytics: attendance, engagement score, chat activity

### 4. STUDENT LEARNING EXPERIENCE
- Personalized dashboard with "Continue Learning" widget
- Course catalog with filters: category, level, price, language, rating, duration
- Smart search with full-text search (Supabase pg_trgm)
- Course detail page with curriculum preview, instructor bio, reviews
- Video player with: speed control (0.5x–2x), quality selector, captions, bookmarks, notes
- Progress tracking across lessons and sections
- Mobile-responsive layout with offline support (PWA)
- Note-taking with timestamps linked to video position
- Certificate of Completion generation (PDF with QR code verification)
- Learning streak and gamification (XP, badges, leaderboard)

### 5. ORGANIZATION / B2B MODULE
- Organization workspace with custom subdomain/slug
- Org admin dashboard: manage seats, track team progress, view reports
- Bulk enrollment: assign courses to entire teams or individuals
- Custom learning paths / cohorts for onboarding programs
- SCORM export for LMS integration
- White-label option: custom logo, colors, email templates
- SSO integration
- Usage analytics: time-on-platform, completion rates, quiz scores
- Invoice and billing management for org subscriptions
- Org-level content: create courses only visible to org members

### 6. MONETIZATION ENGINE
**Individual (B2C):**
- One-time course purchase via Stripe Checkout
- Monthly/yearly subscription plans (Stripe Subscriptions + Webhooks)
- Pay-per-live-session tokens
- Freemium: free tier with limited courses + premium unlock
- Discount codes and coupons (percent off, fixed amount, expiry)
- Bundle pricing (multiple courses at discount)
- Instructor revenue share: configurable % split (platform fee model)
- Instructor payout via Stripe Connect

**Organization (B2B):**
- Seat-based licensing (per-seat monthly/yearly)
- Usage-based billing (API for seat overages)
- Custom contract / enterprise pricing tier
- Prepaid credits system
- Multi-currency support

**Stripe Integration:**
- Stripe Checkout Sessions (hosted and embedded)
- Stripe Customer Portal (self-serve subscription management)
- Webhook handler for: payment_intent.succeeded, invoice.paid, 
  customer.subscription.updated/deleted, charge.refunded
- Automatic tax calculation (Stripe Tax)
- Refund policy enforcement

### 7. REAL-TIME FEATURES (Supabase Realtime)
- Live session participant count (broadcast channel)
- Chat messages (postgres changes)
- Raise hand queue (broadcast)
- Poll votes updating live (postgres changes)
- Emoji reactions floating animation (broadcast)
- Notification bell with unread count
- Online/offline presence indicators
- Collaborative whiteboard sync

### 8. ANALYTICS & REPORTING
**Instructor Analytics:**
- Revenue dashboard: MRR, total earnings, per-course revenue
- Student enrollment trends (chart)
- Course completion rates and drop-off points
- Video engagement heatmap (where students re-watch/skip)
- Live session metrics: peak viewers, engagement score, Q&A volume
- Review sentiment analysis

**Student Analytics:**
- Learning time per week (chart)
- Skill progress tracking
- Quiz performance over time
- Certificate collection

**Admin Analytics:**
- Platform-wide: DAU/MAU, revenue, top courses, top instructors
- Cohort analysis
- Churn rate for subscriptions

### 9. NOTIFICATIONS & COMMUNICATION
- In-app notification center with real-time updates
- Email notifications via Resend (transactional templates):
  - Welcome email
  - Course enrollment confirmation
  - Live session reminder (24h + 1h before)
  - Recording ready
  - Certificate issued
  - Payment receipt / refund
  - New review
- Push notifications (Web Push API)
- Notification preferences management

### 10. SEARCH & DISCOVERY
- Full-text course search (pg_trgm + to_tsvector)
- Faceted filtering (category, price range, rating, duration, level)
- Instructor search
- "More like this" course recommendations
- Trending courses algorithm
- Personalized recommendations based on viewing history

### 11. CONTENT MODERATION & ADMIN
- Super admin panel: user management, course approval workflow
- Content reporting system (report inappropriate content)
- Course review/approval before publishing
- Revenue management and instructor payouts
- Platform-wide announcements

### 12. AI FEATURES
- AI-generated course description from curriculum outline
- Automatic quiz generation from lesson content (GPT-4o)
- Live session summary and action items after class ends
- Auto-transcription with timestamp-linked notes
- Smart chapter detection for recorded videos
- Chatbot for student Q&A (RAG over course content)

---

## 🔐 SECURITY REQUIREMENTS

- All Supabase tables must have RLS enabled with explicit policies
- Never expose service role key to the client
- Rate limiting on all API routes (Upstash Redis)
- CSRF protection on mutations
- Input validation with Zod on all forms and API endpoints
- Secure file upload: validate mime type, limit size, scan for malware flag
- Stripe webhook signature verification
- Agora token server-side generation (never expose App Certificate to client)
- Content Security Policy headers
- Audit log for sensitive actions (user deletion, refunds, role changes)

---

## 🎨 UI/UX REQUIREMENTS

- Design system with shadcn/ui + custom Tailwind theme (dark mode supported)
- Fully responsive: mobile-first, tablet, desktop, TV (live room)
- Live room UI optimized for landscape on mobile
- Loading states: skeleton screens everywhere (no blank flash)
- Optimistic UI updates for chat, reactions, progress
- Accessibility: WCAG 2.1 AA, keyboard navigation, screen reader support
- Internationalization: i18n with next-intl (English + Thai at minimum)
- Smooth page transitions with View Transitions API
- Toast notifications (Sonner)

---

## ⚙️ PERFORMANCE REQUIREMENTS

- Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms
- ISR (Incremental Static Regeneration) for course catalog pages
- Image optimization via Next.js Image + Supabase Storage CDN
- Video streaming via adaptive bitrate (Agora handles this)
- Database query optimization: all N+1 queries eliminated with joins
- Connection pooling via Supabase Pgbouncer
- Edge caching for public API routes

---

## 🚀 IMPLEMENTATION ORDER

Build in this exact sequence to ensure each layer is solid before the next:

1. **Phase 1 – Foundation**
   - Supabase project setup, schema migration, RLS policies
   - Next.js project scaffold with TypeScript, Tailwind, shadcn/ui
   - Auth flow (login/signup/OAuth/magic-link) + role middleware

2. **Phase 2 – Core Course Platform**
   - Course CRUD (instructor dashboard)
   - Video upload + lesson management
   - Student enrollment + video player + progress tracking

3. **Phase 3 – Live Room**
   - Agora integration (video/audio)
   - Real-time chat (Supabase Realtime)
   - Polls, reactions, raise hand, whiteboard

4. **Phase 4 – Monetization**
   - Stripe Checkout + webhooks
   - Subscription plans + Stripe Customer Portal
   - Instructor payouts (Stripe Connect)

5. **Phase 5 – B2B / Organization**
   - Organization workspace
   - Seat management + team analytics
   - White-label theming

6. **Phase 6 – AI & Analytics**
   - AI course summary, quiz generation
   - Analytics dashboards
   - Notification system

7. **Phase 7 – Polish & Scale**
   - Search optimization
   - Performance tuning
   - PWA + offline support
   - i18n

---

## 📦 KEY DEPENDENCIES

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "@supabase/supabase-js": "^2.43.0",
    "@supabase/ssr": "^0.5.0",
    "agora-rtc-react": "^2.2.0",
    "agora-rtc-sdk-ng": "^4.20.0",
    "stripe": "^15.0.0",
    "@stripe/stripe-js": "^3.0.0",
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.40.0",
    "zod": "^3.23.0",
    "react-hook-form": "^7.52.0",
    "@hookform/resolvers": "^3.6.0",
    "excalidraw": "^0.17.0",
    "sonner": "^1.5.0",
    "next-intl": "^3.15.0",
    "@hello-pangea/dnd": "^16.6.0",
    "react-player": "^2.16.0",
    "resend": "^3.4.0",
    "sharp": "^0.33.0",
    "@radix-ui/react-*": "latest",
    "recharts": "^2.12.0",
    "date-fns": "^3.6.0",
    "openai": "^4.52.0"
  }
}
```

---

## ✅ QUALITY CHECKLIST

Before considering any module complete, verify:

- [ ] TypeScript strict mode: no `any` types
- [ ] All database queries use parameterized inputs (no SQL injection)
- [ ] RLS policies tested for each role (instructor, student, org_admin)
- [ ] Loading, empty, and error states handled for every async operation
- [ ] Mobile responsiveness tested at 375px, 768px, 1280px, 1920px
- [ ] Real-time subscriptions properly cleaned up on component unmount
- [ ] Stripe webhooks idempotent (handle duplicate events)
- [ ] Agora tokens expire and refresh correctly
- [ ] All forms have Zod validation + server-side re-validation
- [ ] Core Web Vitals pass in production build
- [ ] Environment variables documented in `.env.example`

---

## 🌐 ENVIRONMENT VARIABLES

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Agora
NEXT_PUBLIC_AGORA_APP_ID=
AGORA_APP_CERTIFICATE=
AGORA_CLOUD_RECORDING_KEY=
AGORA_CLOUD_RECORDING_SECRET=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=

# OpenAI (for AI features)
OPENAI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME=
```

---

*Generated for production-grade Live Learning Platform | Next.js + Supabase | All user types: B2C / B2B / Bootcamp*