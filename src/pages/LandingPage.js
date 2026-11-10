import React, { useState } from 'react';
import { User, Users, Shield, MessageSquare, Calendar, Target, TrendingUp, CheckCircle, Github, Linkedin, Mail, MapPin, Menu, X, MessageCircle, ArrowRight, Award, Sun, Moon } from 'lucide-react';
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

  const navLinks = ['Features', 'How it Works', 'Roles', 'About', 'Contact'];

  const features = [
    {
      title: 'Task & Goal Assignment',
      description: 'Create, assign, and track personalized tasks and goals for each mentee.',
      icon: Target,
    },
    {
      title: 'Real-time Chat & Notifications',
      description: 'Instant messaging and smart notifications to keep everyone connected.',
      icon: MessageSquare,
    },
    {
      title: 'Progress Tracking',
      description: 'Comprehensive analytics and progress monitoring for mentees.',
      icon: TrendingUp,
    },
    {
      title: 'Offline Meeting Attendance',
      description: 'Track and manage offline meeting attendance with ease.',
      icon: Calendar,
    },
    {
      title: 'Admin Management System',
      description: 'Complete administrative control over users, departments, and batches.',
      icon: Shield,
    },
    {
      title: 'Certificate Management',
      description: 'Upload and manage student certificates and achievements.',
      icon: Award,
    },
  ];

  const roles = [
    {
      title: 'Admin',
      icon: Shield,
      features: [
        'Manage mentors and students',
        'Organize departments and batches',
        'System-wide analytics',
        'User access control',
        'Platform configuration'
      ]
    },
    {
      title: 'Mentor',
      icon: Users,
      features: [
        'Assign tasks and goals',
        'Real-time communication',
        'Track mentee progress',
        'Manage offline attendance'
      ]
    },
    {
      title: 'Student',
      icon: User,
      features: [
        'View assigned tasks',
        'Chat with mentors',
        'Track personal progress',
        'Access learning resources'
      ]
    }
  ];

  const benefits = [
    'Seamless mentor-mentee communication',
    'Smart task management system',
    'Built specifically for academic institutions',
    'Scalable and secure architecture',
    'Real-time progress monitoring',
    'Integrated video conferencing'
  ];

  const steps = [
    {
      number: '01',
      title: 'Sign Up & Setup',
      description: 'Create your account and set up your profile with your academic details.',
      icon: User
    },
    {
      number: '02',
      title: 'Get Matched',
      description: 'Students are assigned to mentors based on their department and batch.',
      icon: Users
    },
    {
      number: '03',
      title: 'Start Collaborating',
      description: 'Begin communicating, assigning tasks, and tracking progress immediately.',
      icon: MessageCircle
    }
  ];

  const dashboardPath = isAuthenticated && user && user.role
    ? `/${user.role.toLowerCase()}/dashboard`
    : '/login';

  return (
    <div className="min-h-screen bg-gray-50 font-sans transition-colors duration-150 dark:bg-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/90">
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
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
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
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
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

        {/* Mobile menu */}
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

      {/* Hero Section */}
      <section className="border-b border-gray-200 bg-white pt-32 pb-20 dark:border-slate-700/70 dark:bg-slate-900 sm:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="badge badge-brand">Academic mentorship platform</span>
              <h1 className="page-title mt-5 text-4xl sm:text-5xl lg:text-6xl">
                Empowering
                <span className="block text-brand-600 dark:text-brand-400">Future Leaders</span>
              </h1>
              <p className="page-subtitle mt-5 max-w-xl text-base sm:text-lg">
                A comprehensive platform bridging the gap between mentors and students.
                Streamline communication, track progress, and achieve academic excellence together.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/login" className="btn-primary btn-lg">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <a href="#features" className="btn-secondary btn-lg">
                  Learn More
                </a>
              </div>

              <div className="mt-10 flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-brand-600 text-xs font-semibold text-white dark:border-slate-900"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p>Trusted by students and mentors alike</p>
              </div>
            </div>

            {/* Product preview */}
            <div className="relative hidden lg:block">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                {/* Preview header */}
                <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-gray-300 dark:bg-slate-600"></span>
                    <span className="h-3 w-3 rounded-full bg-gray-300 dark:bg-slate-600"></span>
                    <span className="h-3 w-3 rounded-full bg-gray-300 dark:bg-slate-600"></span>
                  </div>
                  <span className="h-2 w-32 rounded-full bg-gray-200 dark:bg-slate-700"></span>
                </div>
                {/* Preview body */}
                <div className="space-y-6 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="mb-2 h-3 w-20 rounded bg-gray-200 dark:bg-slate-700"></div>
                      <div className="h-5 w-32 rounded bg-gray-800 dark:bg-slate-500"></div>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/10">
                      <User className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-slate-700 dark:bg-slate-900">
                      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">Tasks</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">12</div>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-slate-700 dark:bg-slate-900">
                      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">Meetings</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">5</div>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-slate-700 dark:bg-slate-900">
                      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">Progress</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">85%</div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="h-3 w-24 rounded bg-gray-200 dark:bg-slate-700"></div>
                      <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-900">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/10">
                          <MessageSquare className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1.5 h-2.5 w-3/4 rounded bg-gray-300 dark:bg-slate-600"></div>
                          <div className="h-2 w-1/2 rounded bg-gray-100 dark:bg-slate-700"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-900">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10">
                          <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1.5 h-2.5 w-2/3 rounded bg-gray-300 dark:bg-slate-600"></div>
                          <div className="h-2 w-1/3 rounded bg-gray-100 dark:bg-slate-700"></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-1/3 flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-2 dark:border-slate-700 dark:bg-slate-900">
                      <div className="mb-2 h-14 w-14 rounded-full border-4 border-brand-500 border-t-transparent"></div>
                      <div className="h-2 w-10 rounded bg-gray-200 dark:bg-slate-700"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="border-b border-gray-200 bg-gray-50 py-20 dark:border-slate-700/70 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow">Process</p>
            <h2 className="page-title mt-2">How MenteeConnect Works</h2>
            <p className="page-subtitle mt-3">
              Getting started is easy. Follow these simple steps to begin your mentorship journey.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="card card-pad">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-semibold text-gray-400 dark:text-slate-500">Step {step.number}</span>
                  </div>
                  <h3 className="section-title mt-4">{step.title}</h3>
                  <p className="muted mt-2 text-sm">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="border-b border-gray-200 bg-white py-20 dark:border-slate-700/70 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow">Features</p>
            <h2 className="page-title mt-2">Everything You Need</h2>
            <p className="page-subtitle mt-3">
              Comprehensive tools designed to enhance the mentorship experience for everyone involved.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card card-pad card-hover">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="section-title mt-4">{feature.title}</h3>
                  <p className="muted mt-2 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Role-Based Access */}
      <section id="roles" className="border-b border-gray-200 bg-gray-50 py-20 dark:border-slate-700/70 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow">Ecosystem</p>
            <h2 className="page-title mt-2">Tailored for Everyone</h2>
            <p className="page-subtitle mt-3">
              Specific tools and dashboards for every role in your institution.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {roles.map((role, index) => {
              const Icon = role.icon;
              return (
                <div key={index} className="card card-pad flex h-full flex-col">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="section-title">{role.title}</h3>
                  </div>
                  <ul className="mt-5 flex-grow space-y-3">
                    {role.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-slate-400">
                        <CheckCircle className="mr-2.5 mt-0.5 h-4 w-4 flex-shrink-0 text-brand-600 dark:text-brand-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 border-t border-gray-200 pt-5 dark:border-slate-700">
                    <Link to="/login" className="link inline-flex items-center text-sm font-semibold">
                      Access Portal
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About the Application */}
      <section id="about" className="border-b border-gray-200 bg-white py-20 dark:border-slate-700/70 dark:bg-slate-800">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="flex flex-col justify-center p-8 sm:p-12">
                <p className="eyebrow">About Us</p>
                <h2 className="page-title mt-2">Bridging the Gap in Education</h2>
                <p className="muted mt-5 leading-relaxed">
                  MenteeConnect is a comprehensive mentor-mentee management system designed specifically for colleges and educational institutions.
                  This platform bridges the gap between mentors and students by providing intuitive tools for communication, task management,
                  and progress tracking.
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-gray-200 dark:border-slate-900 dark:bg-slate-700"></div>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Join our growing community</span>
                </div>
              </div>
              <div className="bg-brand-600 p-8 text-white sm:p-12">
                <h3 className="text-xl font-semibold">Why Choose MenteeConnect?</h3>
                <ul className="mt-6 space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle className="mr-3 h-4 w-4 flex-shrink-0 text-white" />
                      <span className="font-medium">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="border-b border-gray-200 bg-gray-50 py-20 dark:border-slate-700/70 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow">The Mind Behind</p>
            <h2 className="page-title mt-2">Meet the Developer</h2>
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
                <span className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-4 border-white bg-emerald-500 dark:border-slate-800"></span>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{devInfo.name}</h3>
                <p className="mt-1 font-medium text-brand-600 dark:text-brand-400">{devInfo.title}</p>
                <p className="muted mt-4 leading-relaxed">
                  {devInfo.bio}
                  <br />
                  MenteeConnect represents my commitment to improving academic mentorship through modern web technologies.
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

      {/* Contact Section */}
      <section id="contact" className="border-b border-gray-200 bg-white py-20 dark:border-slate-700/70 dark:bg-slate-800">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow">Contact</p>
            <h2 className="page-title mt-2">Get in Touch</h2>
            <p className="page-subtitle mt-3">Have questions? Want to collaborate? Let's connect.</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="card card-pad card-hover">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                <Mail className="h-5 w-5" />
              </span>
              <h3 className="section-title mt-4">Email Us</h3>
              <p className="muted mt-1 text-sm">For inquiries and support</p>
              <a href="mailto:contact.shindemahesh2112@gmail.com" className="link mt-3 inline-block text-sm font-medium">
                contact.shindemahesh2112@gmail.com
              </a>
            </div>

            <div className="card card-pad card-hover">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                <MapPin className="h-5 w-5" />
              </span>
              <h3 className="section-title mt-4">Visit Us</h3>
              <p className="muted mt-1 text-sm">Sanjivani College of Engineering</p>
              <p className="mt-3 text-sm font-medium text-brand-600 dark:text-brand-400">
                Kopargaon, Maharashtra
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3">
                <MenteeConnectLogo size="md" showText={false} variant="white" />
                <span className="text-xl font-semibold text-white">MenteeConnect</span>
              </div>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-400">
                Empowering mentorship through technology. Built by students, for students to create meaningful connections.
              </p>
              <div className="mt-6 flex gap-3">
                {[Github, Linkedin, Mail].map((Icon, i) => (
                  <button
                    key={i}
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-brand-600"
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h4>
              <ul className="mt-5 space-y-3">
                {['Features', 'Roles', 'About', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-sm text-slate-400 transition-colors hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Legal</h4>
              <ul className="mt-5 space-y-3">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                  <li key={item}>
                    <button type="button" className="text-sm text-slate-400 transition-colors hover:text-white">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-800 pt-8 md:flex-row">
            <p className="text-center text-sm text-slate-500 md:text-left">
              © 2025 MenteeConnect. Developed by <span className="font-medium text-white">Mahesh Shinde</span>
            </p>
            <div className="mt-4 flex items-center gap-2 md:mt-0">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="text-sm text-slate-500">All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
