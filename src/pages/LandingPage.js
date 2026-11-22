import React, { useState } from 'react';
import {
  User,
  Users,
  Shield,
  Target,
  TrendingUp,
  CheckCircle,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  X,
  ArrowRight,
  Award,
  Sun,
  Moon,
  Video,
  Bell,
  Upload,
  Sparkles,
  Clock,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';
import MenteeConnectLogo from '../MenteeConnectLogo';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  const devInfo = {
    name: 'Mahesh Shinde',
    title: 'Full Stack Java & Android Developer',
    bio: 'A passionate and self-driven developer with a strong interest in Android and web development. I enjoy building creative digital solutions and continuously exploring new technologies to enhance my skills.',
    photo: '/mahesh.png',
  };

  const navLinks = ['Features', 'How it works', 'Roles', 'About', 'Contact'];

  const metrics = [
    { label: 'Role-based workspaces', value: '3' },
    { label: 'In-browser video calls', value: 'HD' },
    { label: 'Bulk CSV onboarding', value: 'Minutes' },
    { label: 'Real-time updates', value: 'Live' },
  ];

  const features = [
    {
      title: 'Live video mentoring',
      description: 'Start a face-to-face call from the dashboard. No downloads, no meeting links — just accept and talk.',
      icon: Video,
    },
    {
      title: 'Tasks that stay visible',
      description: 'Mentors assign goals with clear status. Students always know what is next and what is done.',
      icon: Target,
    },
    {
      title: 'Attendance & progress',
      description: 'Record offline meetings and keep attendance and CGPA in one place, visible to the right people.',
      icon: TrendingUp,
    },
    {
      title: 'Certificates & achievements',
      description: 'Students upload certificates; mentors and admins can review them without digging through email.',
      icon: Award,
    },
    {
      title: 'Notifications that land',
      description: 'Announcements reach the right role instantly, with a live unread badge and a clear history.',
      icon: Bell,
    },
    {
      title: 'Admin control center',
      description: 'Manage people, departments and batches. Onboard entire cohorts with a single CSV upload.',
      icon: Shield,
    },
  ];

  const roles = [
    {
      title: 'Admin',
      icon: Shield,
      tagline: 'Keep the whole program coherent.',
      features: [
        'Invite and manage mentors, students and admins',
        'Organize departments and batches',
        'Bulk CSV onboarding for new cohorts',
        'Platform-wide analytics and call history',
      ],
    },
    {
      title: 'Mentor',
      icon: Users,
      tagline: 'Guide without the busywork.',
      features: [
        'See every mentee in one dashboard',
        'Assign tasks and mark progress',
        'Record offline attendance in seconds',
        'Call mentees directly from the browser',
      ],
    },
    {
      title: 'Student',
      icon: User,
      tagline: 'Know exactly where you stand.',
      features: [
        'See assigned tasks and due dates',
        'Call your mentor when you need help',
        'Track attendance, CGPA and skills',
        'Upload certificates and achievements',
      ],
    },
  ];

  const benefits = [
    'Browser-based video calls — no downloads',
    'One shared plan for mentors and students',
    'Bulk onboarding for entire cohorts',
    'Role-aware security and access',
    'Attendance and progress in one view',
    'Built for real academic workflows',
  ];

  const steps = [
    {
      number: '01',
      title: 'Bring your people in',
      description: 'Admins add mentors and students individually or upload a CSV to onboard a whole cohort at once.',
      icon: Upload,
    },
    {
      number: '02',
      title: 'Match and schedule',
      description: 'Assign mentors to students and batches. Everyone lands in a workspace built for their role.',
      icon: Users,
    },
    {
      number: '03',
      title: 'Meet, track, celebrate',
      description: 'Run video calls, assign tasks, log attendance and watch progress build week after week.',
      icon: CheckCircle,
    },
  ];

  const dashboardPath = isAuthenticated && user && user.role
    ? `/${user.role.toLowerCase()}/dashboard`
    : '/login';

  return (
    <div className="min-h-screen bg-gray-50 font-sans transition-colors duration-150 dark:bg-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/85 backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/85">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <button
              type="button"
              className="flex items-center"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <MenteeConnectLogo size="md" showText={true} />
            </button>

            <div className="hidden items-center gap-1 md:flex">
              {navLinks.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  {item}
                </a>
              ))}

              <button
                type="button"
                onClick={toggleTheme}
                className="btn-icon ml-2"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {isAuthenticated ? (
                <Link to={dashboardPath} className="btn-primary ml-2">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary ml-2">
                    Log in
                  </Link>
                  <Link to="/register" className="btn-primary ml-2">
                    Create account
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={toggleTheme}
                className="btn-icon"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="btn-icon"
                aria-label="Toggle navigation"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="border-t border-gray-200 bg-white md:hidden dark:border-slate-700/70 dark:bg-slate-900">
            <div className="space-y-1 px-4 py-3">
              {navLinks.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <Link
                to={dashboardPath}
                className="btn-primary mt-3 w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Log in'}
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="btn-secondary mt-2 w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create account
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-white pt-32 pb-20 dark:border-slate-700/70 dark:bg-slate-900 sm:pt-36">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-200/50 blur-3xl dark:bg-brand-500/10" />
          <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-purple-200/40 blur-3xl dark:bg-purple-500/10" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="animate-fade-up">
              <span className="badge badge-brand">
                <Sparkles className="h-3.5 w-3.5" />
                One workspace for academic mentorship
              </span>
              <h1 className="page-title mt-5 text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">
                Mentorship that
                <span className="block bg-gradient-to-r from-brand-600 via-brand-500 to-purple-500 bg-clip-text text-transparent dark:from-brand-300 dark:via-brand-400 dark:to-purple-300">
                  keeps everyone moving
                </span>
              </h1>
              <p className="page-subtitle mt-5 max-w-xl text-base sm:text-lg">
                MenteeConnect brings admins, mentors and students onto one shared plan — tasks,
                attendance, progress, certificates and face-to-face video calls, without the
                spreadsheet chaos.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to={dashboardPath} className="btn-primary btn-lg">
                  {isAuthenticated ? 'Open your workspace' : 'Sign in to your workspace'}
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <a href="#features" className="btn-secondary btn-lg">
                  Explore features
                </a>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  Role-based access
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  In-browser video calls
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  Built for colleges
                </span>
              </div>
            </div>

            {/* Product preview */}
            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-tr from-brand-500/20 via-purple-500/10 to-transparent blur-2xl" />
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-400/70" />
                    <span className="h-3 w-3 rounded-full bg-amber-400/70" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
                  </div>
                  <span className="text-[11px] font-medium text-gray-400 dark:text-slate-500">
                    menteeconnect.app / dashboard
                  </span>
                </div>

                <div className="space-y-5 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                        Today
                      </div>
                      <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                        Mentorship pulse
                      </div>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/10">
                      <TrendingUp className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Tasks', value: '12' },
                      { label: 'Meetings', value: '5' },
                      { label: 'Progress', value: '85%' },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-slate-700 dark:bg-slate-900"
                      >
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                          {stat.label}
                        </div>
                        <div className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-brand-200 bg-brand-50/60 p-4 dark:border-brand-500/30 dark:bg-brand-500/10">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white">
                          <Video className="h-5 w-5" />
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            Weekly check-in
                          </div>
                          <div className="text-xs text-gray-500 dark:text-slate-400">
                            With Dr. Rao · in 15 minutes
                          </div>
                        </div>
                      </div>
                      <span className="badge-success">Join</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[
                      { icon: CheckCircle, text: 'Project outline approved', color: 'text-emerald-500' },
                      { icon: Clock, text: 'Attendance report due Friday', color: 'text-amber-500' },
                    ].map((item) => (
                      <div
                        key={item.text}
                        className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
                      >
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                        <span className="text-sm text-gray-600 dark:text-slate-300">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics band */}
      <section className="border-b border-gray-200 bg-gray-50 dark:border-slate-700/70 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          {metrics.map((metric) => (
            <div key={metric.label} className="px-4 py-4 text-center">
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">{metric.value}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-gray-500 dark:text-slate-400">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-b border-gray-200 bg-white py-20 dark:border-slate-700/70 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow">How it works</p>
            <h2 className="page-title mt-2">From roster to real momentum</h2>
            <p className="page-subtitle mt-3">
              Three steps to replace scattered spreadsheets, chat threads and missed meetings.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="card card-pad card-hover">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold text-gray-400 dark:text-slate-500">
                    Step {step.number}
                  </span>
                </div>
                <h3 className="section-title mt-4">{step.title}</h3>
                <p className="muted mt-2 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="border-b border-gray-200 bg-gray-50 py-20 dark:border-slate-700/70 dark:bg-slate-800/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow">Features</p>
            <h2 className="page-title mt-2">Everything the program needs — and nothing it doesn’t</h2>
            <p className="page-subtitle mt-3">
              Purpose-built for academic mentorship, not a generic project tracker.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="card card-pad card-hover">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                  <feature.icon className="h-5 w-5" />
                </span>
                <h3 className="section-title mt-4">{feature.title}</h3>
                <p className="muted mt-2 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="border-b border-gray-200 bg-white py-20 dark:border-slate-700/70 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow">Built for every role</p>
            <h2 className="page-title mt-2">A workspace that fits the person using it</h2>
            <p className="page-subtitle mt-3">
              Admins get control, mentors get clarity, students get direction.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {roles.map((role) => (
              <div key={role.title} className="card card-pad card-hover flex h-full flex-col">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                    <role.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="section-title">{role.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{role.tagline}</p>
                  </div>
                </div>
                <ul className="mt-5 flex-grow space-y-3">
                  {role.features.map((feature) => (
                    <li key={feature} className="flex items-start text-sm text-gray-600 dark:text-slate-400">
                      <CheckCircle className="mr-2.5 mt-0.5 h-4 w-4 flex-shrink-0 text-brand-600 dark:text-brand-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 border-t border-gray-200 pt-5 dark:border-slate-700">
                  <Link to="/login" className="link inline-flex items-center text-sm font-semibold">
                    Access portal
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-b border-gray-200 bg-gray-50 py-20 dark:border-slate-700/70 dark:bg-slate-800/40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="flex flex-col justify-center p-8 sm:p-12">
                <p className="eyebrow">About MenteeConnect</p>
                <h2 className="page-title mt-2">Built around the relationship, not the paperwork</h2>
                <p className="muted mt-5 leading-relaxed">
                  MenteeConnect is a mentor-mentee management system for colleges and universities.
                  It replaces scattered spreadsheets and chat threads with one shared space for
                  communication, tasks, progress and face-to-face meetings.
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-brand-100 text-xs font-semibold text-brand-700 dark:border-slate-900 dark:bg-brand-500/20 dark:text-brand-300"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    Designed for students and faculty
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-brand-600 via-brand-600 to-purple-600 p-8 text-white sm:p-12">
                <h3 className="text-xl font-semibold">Why teams choose it</h3>
                <ul className="mt-6 space-y-4">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center text-sm">
                      <CheckCircle className="mr-3 h-4 w-4 flex-shrink-0 text-white/90" />
                      <span className="font-medium">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer */}
      <section className="border-b border-gray-200 bg-white py-20 dark:border-slate-700/70 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow">The mind behind</p>
            <h2 className="page-title mt-2">Meet the developer</h2>
          </div>

          <div className="card card-pad mt-10">
            <div className="flex flex-col items-center gap-8 md:flex-row">
              <div className="relative flex-shrink-0">
                <img
                  src={devInfo.photo}
                  alt={devInfo.name}
                  loading="lazy"
                  decoding="async"
                  className="h-32 w-32 rounded-full border border-gray-200 object-cover dark:border-slate-700"
                />
                <span className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-4 border-white bg-emerald-500 dark:border-slate-800" />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{devInfo.name}</h3>
                <p className="mt-1 font-medium text-brand-600 dark:text-brand-400">{devInfo.title}</p>
                <p className="muted mt-4 leading-relaxed">
                  {devInfo.bio}
                  <br />
                  MenteeConnect represents my commitment to improving academic mentorship through
                  modern web technologies.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
                  <a href="https://github.com/coder-mahi" target="_blank" rel="noopener noreferrer" className="btn-secondary btn-sm">
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                  <a href="https://www.linkedin.com/in/mahesh-shinde-0a666b23b" target="_blank" rel="noopener noreferrer" className="btn-secondary btn-sm">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                  <a href="https://shindemaheshportfolio.netlify.app" target="_blank" rel="noopener noreferrer" className="btn-secondary btn-sm">
                    <User className="h-4 w-4" />
                    Portfolio
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-b border-gray-200 bg-gray-50 py-20 dark:border-slate-700/70 dark:bg-slate-800/40">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow">Contact</p>
            <h2 className="page-title mt-2">Talk to us</h2>
            <p className="page-subtitle mt-3">
              Questions about rolling this out at your college? We would love to hear from you.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="card card-pad card-hover">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                <Mail className="h-5 w-5" />
              </span>
              <h3 className="section-title mt-4">Email</h3>
              <p className="muted mt-1 text-sm">For inquiries and support</p>
              <a href="mailto:contact.shindemahesh2112@gmail.com" className="link mt-3 inline-block text-sm font-medium">
                contact.shindemahesh2112@gmail.com
              </a>
            </div>

            <div className="card card-pad card-hover">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                <MapPin className="h-5 w-5" />
              </span>
              <h3 className="section-title mt-4">Visit</h3>
              <p className="muted mt-1 text-sm">Sanjivani College of Engineering</p>
              <p className="mt-3 text-sm font-medium text-brand-600 dark:text-brand-400">
                Kopargaon, Maharashtra
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3">
                <MenteeConnectLogo size="md" showText={false} variant="white" />
                <span className="text-xl font-semibold text-white">MenteeConnect</span>
              </div>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-400">
                Mentorship, without the busywork. Built by students, for students to create
                meaningful academic connections.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Product</h4>
              <ul className="mt-5 space-y-3">
                {[
                  ['Features', '#features'],
                  ['How it works', '#how-it-works'],
                  ['Roles', '#roles'],
                ].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-sm text-slate-400 transition-colors hover:text-white">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Get started</h4>
              <ul className="mt-5 space-y-3">
                <li>
                  <Link to="/login" className="text-sm text-slate-400 transition-colors hover:text-white">
                    Log in
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-sm text-slate-400 transition-colors hover:text-white">
                    Create account
                  </Link>
                </li>
                <li>
                  <a href="#contact" className="text-sm text-slate-400 transition-colors hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-800 pt-8 md:flex-row">
            <p className="text-center text-sm text-slate-500 md:text-left">
              © 2026 MenteeConnect. Developed by <span className="font-medium text-white">Mahesh Shinde</span>
            </p>
            <div className="mt-4 flex items-center gap-2 md:mt-0">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-sm text-slate-500">All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
