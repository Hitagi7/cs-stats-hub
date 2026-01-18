# Counter-Strike 2 AI Stats App

## Overview
**Counter-Strike 2 AI Stats App** is a full-stack web application built with **Next.js 16 (App Router)**, **Supabase** for backend services, and **Google Gemini AI** for intelligent statistics analysis.

Users can:
- Track CS2 player statistics
- View match history
- Receive AI-powered insights such as performance trends and improvement recommendations

The app fetches real-time CS2 data via **Steam Web API**, stores player and user data in **Supabase**, and leverages **Gemini AI** to answer natural-language questions about gameplay performance.

---

## Tech Stack
- **Frontend**: Next.js 16, TypeScript, Tailwind CSS, shadcn/ui
- **Backend / Database**: Supabase (Postgres, Auth, Realtime, Storage)
- **AI**: Google Gemini API
- **APIs**: Steam Web API / CS2 API
- **Deployment**: Vercel

---

## Key Features
- User authentication and profile management using Supabase Auth
- Search and display CS2 player stats:
  - K/D ratio
  - Win rate
  - Weapon usage
  - Match history
- AI-powered insights with Gemini
- Dashboard with performance trend charts
- Save favorite players and compare custom stats
- Real-time updates for live matches via Supabase Realtime

---

## Architecture

### Frontend (Next.js App Router)
```
pages/
├── dashboard/
├── player/[id]/
├── ai-chat/
└── auth/
```

### API Routes
```
/api/
├── stats/[steamId]
├── gemini
└── user/stats
```

### Backend (Supabase)
- Auth
- Database tables: player_stats, user_favorites, match_history
- Realtime updates

### High-Level Flow
User logs in → Searches Steam ID → Fetch stats → Store in Supabase → Ask AI → Get insights

---

## Database Schema

```sql
CREATE TABLE player_stats (
  id UUID PRIMARY KEY,
  steam_id TEXT UNIQUE NOT NULL,
  username TEXT,
  kd_ratio DECIMAL,
  win_rate DECIMAL,
  matches_played INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_favorites (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  steam_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## API Integrations

### Steam Stats
GET /api/stats/:steamId

### Gemini AI
POST /api/gemini

---

## App Structure
```
app/
├── (auth)/
├── dashboard/
├── player/[steamId]/
├── ai/chat/
└── layout.tsx
```

---

## Landing Page

### Design Philosophy
The landing page should convey a **premium gaming aesthetic** with:
- Dark, immersive color scheme inspired by CS2's visual identity
- Vibrant accent colors (orange/amber for CS2 branding, cyan for AI features)
- Glassmorphism effects and subtle gradients
- Smooth micro-animations for engagement
- Modern typography with excellent readability

### Color Palette
```css
/* Primary Colors */
--cs2-dark: #0a0a0f;           /* Deep dark background */
--cs2-darker: #050508;         /* Even darker sections */
--cs2-surface: #12121a;        /* Card/surface backgrounds */
--cs2-border: #1f1f2e;         /* Subtle borders */

/* Accent Colors */
--cs2-orange: #ff6b00;         /* CS2 brand orange */
--cs2-amber: #f59e0b;          /* Warm amber highlights */
--ai-cyan: #06b6d4;            /* AI/Gemini accent */
--ai-purple: #8b5cf6;          /* Secondary AI accent */

/* Text Colors */
--text-primary: #ffffff;
--text-secondary: #a1a1aa;
--text-muted: #71717a;
```

### Page Sections

#### 1. Navigation Header
- **Position**: Fixed top, transparent with blur backdrop on scroll
- **Content**:
  - Logo: "CS2 Stats Hub" with gaming-style typography
  - Nav links: Features, AI Insights, Dashboard (disabled if not logged in)
  - Auth buttons: "Sign In" (ghost) | "Get Started" (primary gradient)

#### 2. Hero Section
- **Layout**: Full viewport height, centered content
- **Background**: Animated gradient mesh or CS2-themed abstract patterns
- **Content**:
  - **Headline**: "Master Your CS2 Game with AI-Powered Insights"
  - **Subheadline**: "Track your stats, analyze your performance, and get personalized recommendations powered by Google Gemini"
  - **Steam ID Search**: Large, prominent search input with placeholder "Enter Steam ID or Profile URL"
  - **CTA Button**: "Analyze My Stats" with gradient background and hover glow
  - **Social proof**: "Join 10,000+ players improving their game"

#### 3. Features Grid
- **Layout**: 3-column grid (responsive to 1 column on mobile)
- **Cards** (glassmorphic with subtle border glow on hover):
  1. **📊 Real-Time Stats**
     - K/D ratio, win rate, headshot percentage
     - Live match tracking with Supabase Realtime
  2. **🤖 AI-Powered Analysis**
     - Natural language questions about your gameplay
     - Performance trends and improvement tips
  3. **🎯 Match History**
     - Detailed breakdown of recent matches
     - Weapon usage and map performance
  4. **⚡ Compare & Compete**
     - Compare stats with friends
     - Track your ranking progression
  5. **⭐ Favorites**
     - Save and monitor pro players
     - Get notified of their matches
  6. **📈 Trend Charts**
     - Visualize performance over time
     - Identify strengths and weaknesses

#### 4. AI Showcase Section
- **Layout**: Split section with visual on one side
- **Visual**: Mockup of AI chat interface with example conversation
- **Content**:
  - "Ask Anything About Your Gameplay"
  - Example queries:
    - "What's my best weapon this month?"
    - "How can I improve my clutch rate?"
    - "Compare my stats to s1mple"

#### 5. Stats Preview Section
- **Layout**: Dark card with animated stat counters
- **Content**: Live demo stats or example player card
- **Animation**: Numbers counting up on scroll into view

#### 6. CTA Section
- **Background**: Gradient from dark to CS2 orange
- **Content**:
  - "Ready to Level Up?"
  - Large "Get Started Free" button
  - "No credit card required"

#### 7. Footer
- **Content**:
  - Logo and brief description
  - Links: About, Privacy, Terms, GitHub
  - "Powered by Steam API & Google Gemini"
  - Copyright notice

### Responsive Breakpoints
```css
/* Mobile First */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

### Animation Guidelines
- **Entrance animations**: Fade up with staggered delays
- **Hover effects**: Subtle scale (1.02-1.05) with shadow enhancement
- **Gradient animations**: Slow, continuous color shifts on hero background
- **Scroll triggers**: Counter animations, section reveals

### Accessibility Requirements
- Minimum contrast ratio 4.5:1 for text
- Focus visible states for all interactive elements
- Reduced motion support for users who prefer it
- Semantic HTML structure with proper heading hierarchy
