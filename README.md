<div align="center">

# 🎓 Live Learning

**แพลตฟอร์มเรียนสดออนไลน์ — จองคลาส ปรึกษาอาจารย์ เข้าเรียนสดได้ทุกที่**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-Private-red)]()

</div>

---

## 📖 Overview

**Live Learning** เป็นแพลตฟอร์มการเรียนสดออนไลน์ครบวงจร ที่ช่วยให้นักเรียนสามารถค้นหาคอร์ส จองเรียนกับอาจารย์ เข้าห้องเรียนสด หรือแม้แต่โพสต์คำขอปรึกษาเพื่อให้อาจารย์มาเสนอรับสอน ออกแบบด้วย **Clean Architecture** เพื่อความเป็นระเบียบ ขยายง่าย และทดสอบได้

### ✨ Highlights

- 🔴 **Live Session** — ห้องเรียนสดพร้อม Video/Audio & Chat
- 📅 **Smart Booking** — จองคลาสจาก Time Slot ของอาจารย์ตรงๆ
- 💬 **Consultation Board** — นักเรียนโพสต์คำถาม อาจารย์มารับงาน *(NEW)*
- 🎨 **Role-Based UX** — UI ปรับตาม Student / Instructor / Admin
- 🏗️ **Clean Architecture** — แยก layer ชัดเจน ง่ายต่อ maintenance

---

## 🏗️ Architecture

```
live-learning-nextjs/
├── app/                        # Next.js App Router (Pages & Layouts)
│   ├── (main)/                 # Main layout routes
│   │   ├── page.tsx            # Home / Dashboard
│   │   ├── courses/            # Course catalog & detail
│   │   ├── instructors/        # Instructor listing & profile
│   │   ├── categories/         # Category browser
│   │   ├── live/               # Live sessions list
│   │   ├── consultations/      # Consultation requests
│   │   ├── my-bookings/        # Student bookings
│   │   ├── schedule/           # Instructor schedule
│   │   ├── payment/            # Checkout & Payment status
│   │   ├── profile/            # User profile
│   │   └── settings/           # Settings
│   └── (fullscreen)/           # Fullscreen layout routes
│       ├── auth/               # Login, Register, Forgot/Reset password
│       ├── book/               # Booking flow
│       └── live/[id]/          # Live room (video + chat)
│
├── src/
│   ├── presentation/           # UI Layer
│   │   └── components/         # React components organized by feature
│   ├── application/            # Business Logic Layer
│   │   └── repositories/       # Repository interfaces (contracts)
│   ├── infrastructure/         # Data Layer
│   │   └── repositories/       # Mock & Supabase implementations
│   ├── stores/                 # Zustand state management
│   └── domain/                 # Types & entities
│
└── supabase/
    ├── migrations/             # Database schema migrations
    ├── seeds/                  # Seed data (dev)
    └── config.toml             # Local dev configuration
```

> **Design Principle:** ทุก feature แยก component เป็น folder ตาม domain (courses, booking, live, etc.) ไม่ปนกัน — ง่ายต่อการหาและแก้ไข

---

## 🚀 Features

### 🔐 Authentication & Authorization
| Feature | Description |
|---------|-------------|
| Email/Password Auth | สมัคร + เข้าสู่ระบบผ่าน Supabase Auth |
| Demo Login | 1-click demo cards (Student · Instructor · Admin) |
| Multi-Profile | รองรับหลายโปรไฟล์ต่อ 1 auth account |
| Role-Based Access | `student` · `instructor` · `admin` — menu, page, data ปรับตาม role |
| Row Level Security | RLS policies ทุกตาราง ป้องกัน data leak |

### 📚 Course Catalog
| Feature | Description |
|---------|-------------|
| Browse & Search | ค้นหาคอร์สจากชื่อ, tags, category |
| Filter by Category | 6 หมวดหมู่ — Web · AI · Design · Mobile · Security · DevOps |
| Course Detail | ข้อมูลครบ: ราคา, rating, จำนวนนักเรียน, อาจารย์ผู้สอน |
| Featured Courses | คอร์สแนะนำหน้า Home |

### 👨‍🏫 Instructor System
| Feature | Description |
|---------|-------------|
| Instructor Directory | ลิสต์อาจารย์พร้อม rating, specializations |
| Instructor Profile | Bio, ภาษา, hourly rate, จำนวนนักเรียน |
| Time Slots | ตารางเวลาว่างรายสัปดาห์ (day + time) |
| Online Status | แสดงสถานะออนไลน์/ออฟไลน์ |

### 📅 Booking System
| Feature | Description |
|---------|-------------|
| Book a Class | เลือกคอร์ส → อาจารย์ → วัน/เวลา → ยืนยัน |
| Booking Status | `pending` → `confirmed` → `completed` / `cancelled` |
| My Bookings | หน้ารวม booking ของ student |
| Schedule View | หน้าตารางสอนของ instructor |

### 🔴 Live Sessions
| Feature | Description |
|---------|-------------|
| Session List | รายการ live กำลังถ่ายทอด + กำหนดการ |
| Live Room | Video/Audio + Real-time Chat + Viewer count |
| Controls | Mic/Camera toggle, Leave confirmation |

### 💬 Consultation Requests *(NEW)*
| Feature | Description |
|---------|-------------|
| Post Request | นักเรียนโพสต์หัวข้อที่อยากปรึกษา + เวลาที่สะดวก + งบ |
| Offer Board | อาจารย์เรียกดูคำขอทั้งหมด filter ตาม category |
| Submit Offer | อาจารย์ส่งข้อเสนอ (ราคา + เวลา + message) |
| Accept & Book | นักเรียนเลือกข้อเสนอ → Booking ถูกสร้างอัตโนมัติ |

> 💡 **ทำไมต้องมี?** ระบบเดิมนักเรียนต้องรู้ก่อนว่าจะเรียนกับใคร
> แต่จริงๆ หลายคนแค่มีเรื่องอยากถาม ไม่รู้ว่าอาจารย์คนไหนว่าง
> ฟีเจอร์นี้กลับทิศ: **นักเรียนถาม → อาจารย์มาตอบ**

---

## 🗃️ Database Schema

11 tables, PostgreSQL via Supabase

```
auth.users
  └── profiles            # 1:N (multi-profile)
       ├── profile_roles   # 1:1 (student/instructor/admin)
       ├── instructor_profiles  # extends profile
       │   ├── courses
       │   ├── time_slots
       │   ├── live_sessions
       │   └── consultation_offers
       ├── bookings (as student)
       │   └── payments
       └── consultation_requests (as student)

categories
  ├── courses
  └── consultation_requests
```

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles (extends auth.users) |
| `profile_roles` | Role assignment (student / instructor / admin) |
| `categories` | Course categories (6 types) |
| `instructor_profiles` | Instructor data (bio, rating, hourly_rate) |
| `courses` | Course catalog |
| `time_slots` | Weekly instructor availability |
| `bookings` | Class reservations |
| `payments` | Payment transactions |
| `live_sessions` | Live streaming sessions |
| `consultation_requests` | Student help requests |
| `consultation_offers` | Instructor offers on requests |

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Docker** (for Supabase local)
- **Supabase CLI** (`npx supabase`)

### Installation

```bash
# 1. Clone
git clone https://github.com/danya0365/live-learning-nextjs.git
cd live-learning-nextjs

# 2. Install dependencies
yarn install

# 3. Start Supabase (local)
npx supabase start

# 4. Run migrations & seed
npx supabase db reset

# 5. Start dev server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| 🛡️ Admin | `admin@livelearning.com` | `12345678` |
| 👨‍🏫 Instructor | `somchai@livelearning.com` | `12345678` |
| 🧑‍💻 Student | `min@livelearning.com` | `12345678` |

> 💡 ดูรายชื่อ demo ทั้งหมดได้ที่ `supabase/seeds/000-init_seed.sql`

---

## 📂 Key Scripts

```bash
yarn dev                    # Start dev server (Turbopack)
yarn build                  # Production build
yarn lint                   # ESLint
yarn type-check             # TypeScript check

# Supabase
npx supabase start          # Start local Supabase
npx supabase db reset       # Reset DB + run migrations + seed
npx supabase stop           # Stop local Supabase

# Deploy
yarn deploy:vercel           # Deploy frontend to Vercel
yarn deploy:supabase         # Push migrations to Supabase cloud
yarn deploy:all              # Deploy everything
```

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router + Turbopack) |
| UI | [React 19](https://react.dev/) + [Tailwind CSS 4](https://tailwindcss.com/) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| State | [Zustand 5](https://zustand-demo.pmnd.rs/) |
| Backend | [Supabase](https://supabase.com/) (Auth + PostgreSQL + Storage + RLS) |
| Forms | [React Hook Form 7](https://react-hook-form.com/) + [Zod 4](https://zod.dev/) |
| Charts | [Recharts 3](https://recharts.org/) |
| Payments | [Stripe](https://stripe.com/) |
| Video | [Agora RTC](https://www.agora.io/) |
| Data Fetching | [TanStack React Query 5](https://tanstack.com/query) |
| Animations | [React Spring](https://www.react-spring.dev/) |

---

## 📄 Documentation

| Document | Description |
|----------|-------------|
| [FEATURE.md](./FEATURE.md) | Feature documentation + ฟีเจอร์ใหม่ (Consultation Requests) |
| [supabase/migrations/](./supabase/migrations/) | Database schema (SQL) |
| [supabase/seeds/](./supabase/seeds/) | Seed data for development |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is private and not open for public distribution.

---

<div align="center">

**Built with ❤️ by [Marosdee Uma](https://github.com/danya0365)**

</div>
