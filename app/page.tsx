"use client";

import { useState } from "react";
import AuthButtons from "@/app/components/auth-buttons";

// SVG Icon Components
const ChartIcon = () => (
  <svg className="w-10 h-10 text-[var(--cs2-orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const BrainIcon = () => (
  <svg className="w-10 h-10 text-[var(--cs2-orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

const TargetIcon = () => (
  <svg className="w-10 h-10 text-[var(--cs2-orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12h.01" />
  </svg>
);

const BoltIcon = () => (
  <svg className="w-10 h-10 text-[var(--cs2-orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-10 h-10 text-[var(--cs2-orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

const TrendingIcon = () => (
  <svg className="w-10 h-10 text-[var(--cs2-orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
  </svg>
);

const features = [
  {
    icon: <ChartIcon />,
    title: "Real-Time Stats",
    description: "Track K/D ratio, win rate, and headshot percentage with live match updates powered by Supabase Realtime.",
  },
  {
    icon: <BrainIcon />,
    title: "AI-Powered Analysis",
    description: "Ask natural language questions about your gameplay. Get performance trends and personalized improvement tips.",
  },
  {
    icon: <TargetIcon />,
    title: "Match History",
    description: "Detailed breakdown of your recent matches with weapon usage stats and map performance analytics.",
  },
  {
    icon: <BoltIcon />,
    title: "Compare & Compete",
    description: "Compare your stats with friends or pro players. Track your ranking progression over time.",
  },
  {
    icon: <StarIcon />,
    title: "Favorites",
    description: "Save and monitor your favorite pro players. Get instant access to their stats and recent matches.",
  },
  {
    icon: <TrendingIcon />,
    title: "Trend Charts",
    description: "Visualize your performance over time with interactive charts. Identify your strengths and weaknesses.",
  },
];

const aiQueries = [
  "What's my best weapon this month?",
  "How can I improve my clutch rate?",
  "Compare my stats to s1mple",
  "Which maps should I practice?",
];

const stats = [
  { label: "Players Tracking", value: "10,000+" },
  { label: "Matches Analyzed", value: "1M+" },
  { label: "AI Insights Generated", value: "500K+" },
];

export default function Home() {
  const [steamId, setSteamId] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (steamId.trim()) {
      // TODO: Navigate to player stats page
      console.log("Searching for:", steamId);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 nav-blur border-b border-[var(--cs2-border)]">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gradient-orange">CS2</span>
            <span className="text-2xl font-bold text-white">Stats Hub</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[var(--text-secondary)] hover:text-white transition-colors">
              Features
            </a>
            <a href="#ai-insights" className="text-[var(--text-secondary)] hover:text-white transition-colors">
              AI Insights
            </a>
          </div>
          <AuthButtons />
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-bg min-h-screen flex items-center justify-center pt-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in-up">
            Master Your CS2 Game with{" "}
            <span className="text-gradient-orange">AI-Powered</span> Insights
          </h1>
          <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-100">
            Track your stats, analyze your performance, and get personalized recommendations powered by Google Gemini AI.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8 animate-fade-in-up animation-delay-200">
            <div className="relative flex items-center gap-3">
              <input
                type="text"
                value={steamId}
                onChange={(e) => setSteamId(e.target.value)}
                placeholder="Enter Steam ID or Profile URL"
                className="search-input pr-4"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Analyze My Stats
              </button>
            </div>
          </form>

          {/* Social Proof */}
          <p className="text-[var(--text-muted)] text-sm animate-fade-in-up animation-delay-300">
            Join <span className="text-white font-semibold">10,000+</span> players improving their game
          </p>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
            <svg className="w-6 h-6 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 section-darker">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to <span className="text-gradient-orange">Level Up</span>
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              Powerful tools and insights to help you understand your gameplay and improve your rank.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="feature-card group">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-[var(--cs2-orange)] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[var(--text-secondary)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Showcase Section */}
      <section id="ai-insights" className="py-24 section-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Ask <span className="text-[var(--ai-cyan)]">Anything</span> About Your Gameplay
              </h2>
              <p className="text-[var(--text-secondary)] text-lg mb-8">
                Our AI assistant powered by Google Gemini understands your stats and provides actionable insights in natural language.
              </p>
              <div className="space-y-4">
                {aiQueries.map((query, index) => (
                  <div
                    key={index}
                    className="glass px-4 py-3 rounded-lg flex items-center gap-3 glass-hover cursor-pointer transition-all"
                  >
                    <span className="text-[var(--ai-cyan)]">→</span>
                    <span className="text-[var(--text-secondary)]">&quot;{query}&quot;</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Chat Mockup */}
            <div className="glass rounded-2xl p-6 border border-[var(--cs2-border)]">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--cs2-border)]">
                <div className="w-10 h-10 rounded-full bg-[var(--ai-cyan)] flex items-center justify-center">
                  <span className="text-white text-sm font-bold">AI</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Gemini AI Assistant</h4>
                  <p className="text-xs text-[var(--text-muted)]">Online</p>
                </div>
              </div>

              {/* Chat messages */}
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="bg-[var(--cs2-orange)] text-white px-4 py-2 rounded-2xl rounded-tr-md max-w-[80%]">
                    What&apos;s my best weapon this month?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="glass px-4 py-3 rounded-2xl rounded-tl-md max-w-[80%]">
                    <p className="text-[var(--text-secondary)] text-sm">
                      Based on your last 50 matches, the <span className="text-[var(--ai-cyan)] font-semibold">AK-47</span> is your best performing weapon with:
                    </p>
                    <ul className="text-sm text-[var(--text-secondary)] mt-2 space-y-1">
                      <li>• <span className="text-white">32%</span> headshot rate</li>
                      <li>• <span className="text-white">1.8</span> K/D ratio</li>
                      <li>• <span className="text-white">245</span> total kills</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Preview Section */}
      <section className="py-24 section-darker">
        <div className="max-w-7xl mx-auto px-6">
          <div className="glass rounded-2xl p-8 sm:p-12 text-center border border-[var(--cs2-border)]">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12">
              Trusted by <span className="text-gradient-orange">Thousands</span> of Players
            </h2>
            <div className="grid sm:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl sm:text-5xl font-bold text-gradient-orange mb-2">
                    {stat.value}
                  </div>
                  <p className="text-[var(--text-secondary)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--cs2-dark)] via-[rgba(255,107,0,0.1)] to-[var(--cs2-dark)]" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to <span className="text-gradient-orange">Level Up</span>?
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-10 max-w-xl mx-auto">
            Start tracking your stats and get AI-powered insights to dominate your matches.
          </p>
          <button className="btn-primary text-lg px-8 py-4">
            Get Started Free
          </button>
          <p className="text-[var(--text-muted)] text-sm mt-4">
            No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[var(--cs2-border)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl font-bold text-gradient-orange">CS2</span>
                <span className="text-xl font-bold text-white">Stats Hub</span>
              </div>
              <p className="text-[var(--text-secondary)] max-w-sm">
                Track your Counter-Strike 2 performance and get AI-powered insights to improve your gameplay.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-[var(--text-secondary)] hover:text-white transition-colors">Features</a></li>
                <li><a href="#ai-insights" className="text-[var(--text-secondary)] hover:text-white transition-colors">AI Insights</a></li>
                <li><a href="#" className="text-[var(--text-secondary)] hover:text-white transition-colors">Dashboard</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-[var(--text-secondary)] hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-[var(--text-secondary)] hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-[var(--text-secondary)] hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[var(--cs2-border)] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[var(--text-muted)] text-sm">
              © 2026 <a href="https://github.com/Hitagi7" target="_blank" rel="noopener noreferrer" className="text-[var(--cs2-orange)] hover:text-white transition-colors">Hitagi7</a>. All rights reserved.
            </p>
            <p className="text-[var(--text-muted)] text-sm">
              Powered by <span className="text-[var(--text-secondary)]">Steam API</span> & <span className="text-[var(--ai-cyan)]">Google Gemini</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
