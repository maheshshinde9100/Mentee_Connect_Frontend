import React, { useState } from 'react';
import { User, Users, Shield, MessageSquare, Calendar, Target, TrendingUp, CheckCircle, Github, Linkedin, Mail, MapPin, Menu, X, MessageCircle, ArrowRight, Award, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';

const MenteeConnectLogo = ({ size = "md", animate = false, showText = true }) => {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24"
  };

  return (
    <div className="flex items-center">
      <div className="relative">
        <div className={`${sizes[size]} bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-12 ${animate ? 'animate-pulse' : ''}`}>
          <div className={`${size === 'sm' ? 'h-6 w-6' : size === 'md' ? 'h-8 w-8' : size === 'lg' ? 'h-12 w-12' : 'h-16 w-16'} bg-white rounded-lg flex items-center justify-center transform -rotate-12`}>
            <span className={`text-indigo-600 font-bold ${size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : size === 'lg' ? 'text-xl' : 'text-2xl'}`}>M</span>
          </div>
        </div>
        <div className="absolute -top-2 -right-2 h-6 w-6 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full"></div>
      </div>
      {showText && (
        <span className={`ml-3 font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : size === 'lg' ? 'text-3xl' : 'text-4xl'}`}>
          MenteeConnect
        </span>
      )}
    </div>
  );
};

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

  const features = [
    {
      title: 'Task & Goal Assignment',
      description: 'Create, assign, and track personalized tasks and goals for each mentee.',
      icon: <Target className="h-8 w-8 text-purple-600 dark:text-purple-400" />,
    },
    {
      title: 'Real-time Chat & Notifications',
      description: 'Instant messaging and smart notifications to keep everyone connected.',
      icon: <MessageSquare className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />,
    },
    {
      title: 'Progress Tracking',
      description: 'Comprehensive analytics and progress monitoring for mentees.',
      icon: <TrendingUp className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />,
    },
    {
      title: 'Offline Meeting Attendance',
      description: 'Track and manage offline meeting attendance with ease.',
      icon: <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400" />,
    },
    {
      title: 'Admin Management System',
      description: 'Complete administrative control over users, departments, and batches.',
      icon: <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />,
    },
    {
      title: 'Certificate Management',
      description: 'Upload and manage student certificates and achievements.',
      icon: <Award className="h-8 w-8 text-purple-600 dark:text-purple-400" />,
    },
  ];

  const roles = [
    {
      title: 'Admin',
      icon: <Shield className="h-12 w-12 text-purple-600 dark:text-purple-400" />,
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
      icon: <Users className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />,
      features: [
        'Assign tasks and goals',
        'Real-time communication',
        'Track mentee progress',
        'Manage offline attendance'
      ]
    },
    {
      title: 'Student',
      icon: <User className="h-12 w-12 text-purple-600 dark:text-purple-400" />,
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
      icon: <User className="h-6 w-6 text-white" />
    },
    {
      number: '02',
      title: 'Get Matched',
      description: 'Students are assigned to mentors based on their department and batch.',
      icon: <Users className="h-6 w-6 text-white" />
    },
    {
      number: '03',
      title: 'Start Collaborating',
      description: 'Begin communicating, assigning tasks, and tracking progress immediately.',
      icon: <MessageCircle className="h-6 w-6 text-white" />
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 font-sans min-h-screen transition-colors duration-300">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border-b border-indigo-100 dark:border-slate-800 fixed w-full z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <MenteeConnectLogo size="md" animate />
              </div>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-8">
                {['Features', 'How it Works', 'Roles', 'About', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 text-sm font-medium transition-all duration-300 relative group"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                  </a>
                ))}

                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors focus:outline-none"
                  title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>

                {isAuthenticated ? (
                  <Link
                    to={`/${user.role.toLowerCase()}/dashboard`}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-indigo-500/30 backdrop-blur-sm font-medium flex items-center"
                  >
                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-indigo-500/30 backdrop-blur-sm font-medium"
                  >
                    Log in
                  </Link>
                )}
              </div>
            </div>

            <div className="md:hidden flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors focus:outline-none"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-slate-800 transition-all"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border-t border-indigo-100 dark:border-slate-800 absolute w-full">
            <div className="px-4 pt-2 pb-4 space-y-2">
              {['Features', 'How it Works', 'Roles', 'About', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block px-3 py-2 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-slate-800 rounded-lg transition-all font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              {isAuthenticated ? (
                <Link
                  to={`/${user.role.toLowerCase()}/dashboard`}
                  className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-3 rounded-xl mt-4 font-medium shadow-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-3 rounded-xl mt-4 font-medium shadow-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 overflow-hidden relative min-h-screen flex items-center transition-colors duration-300">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100/50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-6 border border-indigo-200 dark:border-indigo-800">
                <span className="flex h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 mr-2"></span>
                Revolutionizing Academic Mentorship
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
                Empowering <br />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-x">
                  Future Leaders
                </span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-xl leading-relaxed">
                A comprehensive platform bridging the gap between mentors and students.
                Streamline communication, track progress, and achieve academic excellence together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl hover:shadow-indigo-500/30 backdrop-blur-sm flex items-center justify-center"
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <a
                  href="#features"
                  className="border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-8 py-4 rounded-xl text-lg font-semibold hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-slate-800 transition-all backdrop-blur-sm flex items-center justify-center"
                >
                  Learn More
                </a>
              </div>

              <div className="mt-10 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-indigo-${i * 100} flex items-center justify-center text-xs text-white font-bold`}>
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p>Trusted by students and mentors alike</p>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative z-10 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl rounded-3xl p-6 border border-white/50 dark:border-slate-700/50 shadow-2xl hover:rotate-0 transition-all duration-500">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-inner overflow-hidden border border-slate-100 dark:border-slate-700">
                  {/* Mock UI Header */}
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="h-2 w-32 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                  </div>
                  {/* Mock UI Body */}
                  <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                        <div className="h-5 w-32 bg-slate-800 dark:bg-slate-600 rounded"></div>
                      </div>
                      <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800">
                        <div className="text-[10px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold mb-1">Tasks</div>
                        <div className="text-xl font-bold text-slate-800 dark:text-white">12</div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl border border-purple-100 dark:border-purple-800">
                        <div className="text-[10px] uppercase tracking-wider text-purple-600 dark:text-purple-400 font-semibold mb-1">Meetings</div>
                        <div className="text-xl font-bold text-slate-800 dark:text-white">5</div>
                      </div>
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800">
                        <div className="text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-1">Progress</div>
                        <div className="text-xl font-bold text-slate-800 dark:text-white">85%</div>
                      </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex gap-4">
                      {/* Left Column: Recent Activity */}
                      <div className="flex-1 space-y-3">
                        <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-2.5 rounded-lg shadow-sm flex items-center gap-3">
                          <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="h-2.5 w-3/4 bg-slate-300 dark:bg-slate-600 rounded mb-1.5"></div>
                            <div className="h-2 w-1/2 bg-slate-100 dark:bg-slate-700 rounded"></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-2.5 rounded-lg shadow-sm flex items-center gap-3">
                          <div className="h-8 w-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="h-2.5 w-2/3 bg-slate-300 dark:bg-slate-600 rounded mb-1.5"></div>
                            <div className="h-2 w-1/3 bg-slate-100 dark:bg-slate-700 rounded"></div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Chart Placeholder */}
                      <div className="w-1/3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center p-2 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-50 to-transparent dark:from-indigo-900/20 opacity-50"></div>
                        <div className="w-14 h-14 rounded-full border-4 border-indigo-500 border-t-transparent mb-2 z-10"></div>
                        <div className="h-2 w-10 bg-slate-200 dark:bg-slate-700 rounded z-10"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating decorative elements */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl rotate-12 opacity-20"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase text-sm">Process</span>
            <h2 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">How MenteeConnect Works</h2>
            <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Getting started is easy. Follow these simple steps to begin your mentorship journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-indigo-100 dark:bg-slate-800 -z-10 transform -translate-y-1/2"></div>

            {steps.map((step, index) => (
              <div key={index} className="relative bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 text-center group hover:-translate-y-2 transition-all duration-300">
                <div className="h-16 w-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl hover:rotate-0 transition-transform duration-300">
                  {step.icon}
                </div>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 px-4 py-1 rounded-full border border-indigo-100 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 font-bold text-sm shadow-sm">
                  Step {step.number}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-20 bg-slate-50 dark:bg-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-purple-600 dark:text-purple-400 font-semibold tracking-wider uppercase text-sm">Features</span>
            <h2 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">Everything You Need</h2>
            <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Comprehensive tools designed to enhance mentorship experience for everyone involved
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100 dark:border-slate-700 group">
                <div className="flex items-center justify-center w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                  {React.cloneElement(feature.icon, { className: "h-7 w-7 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors duration-300" })}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Access */}
      <section id="roles" className="py-20 bg-white dark:bg-slate-900 overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase text-sm">Ecosystem</span>
            <h2 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">Tailored for Everyone</h2>
            <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Specific tools and dashboards for every role in your institution
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <div key={index} className="relative bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 h-full flex flex-col">
                <div className="text-center mb-8">
                  <div className="inline-flex p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl mb-4">
                    {role.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{role.title}</h3>
                </div>
                <ul className="space-y-4 flex-grow">
                  {role.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                  <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-purple-600 dark:hover:text-purple-400 flex items-center justify-center transition-all">
                    Access Portal <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About the Application */}
      <section id="about" className="py-20 bg-slate-50 dark:bg-slate-800 relative transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-12 flex flex-col justify-center">
                <span className="text-purple-600 dark:text-purple-400 font-semibold tracking-wider uppercase text-sm mb-2">About Us</span>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Bridging the Gap in Education</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  MenteeConnect is a comprehensive mentor-mentee management system designed specifically for colleges and educational institutions.
                  This platform bridges the gap between mentors and students by providing intuitive tools for communication, task management,
                  and progress tracking.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700"></div>
                    ))}
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Join our growing community</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-12 text-white flex flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <h3 className="text-2xl font-bold mb-8 relative z-10">Why Choose MenteeConnect?</h3>
                <ul className="space-y-4 relative z-10">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <div className="bg-white/20 p-1 rounded-full mr-3">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
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
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase text-sm">The Mind Behind</span>
          <h2 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white mb-12">Meet the Developer</h2>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 relative overflow-hidden group hover:border-indigo-200 dark:hover:border-indigo-800 transition-all">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="w-40 h-40 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full p-1 shadow-xl">
                  <img src={devInfo.photo} alt={devInfo.name} loading="lazy" decoding="async" className="w-full h-full object-cover rounded-full bg-white" />
                </div>
                <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-slate-800"></div>
              </div>

              <div className="text-left flex-1">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{devInfo.name}</h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-4">{devInfo.title}</p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  {devInfo.bio}
                  <br />
                  MenteeConnect represents my commitment to improving academic mentorship through modern web technologies.
                </p>

                <div className="flex flex-wrap gap-4">
                  <a href="https://github.com/coder-mahi" target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-lg transition-colors">
                    <Github className="h-5 w-5 mr-2" />
                    GitHub
                  </a>
                  <a href="https://www.linkedin.com/in/mahesh-shinde-0a666b23b" target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-lg transition-colors">
                    <Linkedin className="h-5 w-5 mr-2" />
                    LinkedIn
                  </a>
                  <a href="https://shindemaheshportfolio.netlify.app" target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-400 rounded-lg transition-colors">
                    <User className="h-5 w-5 mr-2" />
                    Portfolio
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-50 dark:bg-slate-800 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Get in Touch</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">Have questions? Want to collaborate? Let's connect!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-6">
                <Mail className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Email Us</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">For inquiries and support</p>
              <a href="mailto:contact.shindemahesh2112@gmail.com" className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300">
                contact.shindemahesh2112@gmail.com
              </a>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Visit Us</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">Sanjivani College of Engineering</p>
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                Kopargaon, Maharashtra
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <MenteeConnectLogo size="md" showText={false} />
                <span className="ml-4 text-2xl font-bold text-white">
                  MenteeConnect
                </span>
              </div>
              <p className="text-slate-400 max-w-md text-lg leading-relaxed mb-8">
                Empowering mentorship through technology. Built by students, for students to create meaningful connections.
              </p>
              <div className="flex space-x-4">
                {[Github, Linkedin, Mail].map((Icon, i) => (
                  <button key={i} className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-all">
                    <Icon className="h-5 w-5 text-white" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3">
                {['Features', 'Roles', 'About', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-slate-400 hover:text-white transition-colors flex items-center group">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Legal</h4>
              <ul className="space-y-3">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                  <li key={item}>
                    <button className="text-slate-400 hover:text-white transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 text-center md:text-left">
              © 2025 MenteeConnect. Developed by <span className="text-white font-medium">Mahesh Shinde</span>
            </p>
            <div className="flex items-center mt-4 md:mt-0 space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-slate-500 text-sm">All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;