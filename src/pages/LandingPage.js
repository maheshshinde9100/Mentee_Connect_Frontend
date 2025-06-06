// Header logo
// <MenteeConnectLogo size="md" animate />

// // Sidebar (icon only)
// <MenteeConnectLogo size="sm" showText={false} />

// // Loading screen
// <MenteeConnectLogo size="xl" animate />

// // Dark background
// <MenteeConnectLogo variant="white" />

// // Minimal version
// <MenteeConnectLogo variant="minimal" showText={false} />


import React, { useState } from 'react';
import { User, Users, Shield, MessageSquare, Calendar, Target, Bell, Video, TrendingUp, CheckCircle, Github, Linkedin, Mail, MapPin, Menu, X, MessageCircle  } from 'lucide-react';

// Mock components for demonstration
const Link = ({ to, children, className }) => (
  <a href={to} className={className}>{children}</a>
);

const useAuth = () => ({
  isAuthenticated: false,
  user: { role: 'student' }
});

const MenteeConnectLogo = ({ size = "md", animate = false, variant = "default", showText = true }) => {
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
        <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full animate-pulse"></div>
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

  const features = [
    {
      title: 'Task & Goal Assignment',
      description: 'Create, assign, and track personalized tasks and goals for each mentee.',
      icon: <Target className="h-8 w-8 text-purple-600" />,
    },
    {
      title: 'Real-time Chat & Notifications',
      description: 'Instant messaging and smart notifications to keep everyone connected.',
      icon: <MessageSquare className="h-8 w-8 text-indigo-600" />,
    },
    {
      title: 'Video Call Integration',
      description: 'Built-in video calling for seamless virtual mentoring sessions.',
      icon: <Video className="h-8 w-8 text-purple-600" />,
    },
    {
      title: 'Progress Tracking',
      description: 'Comprehensive analytics and progress monitoring for mentees.',
      icon: <TrendingUp className="h-8 w-8 text-indigo-600" />,
    },
    {
      title: 'Offline Meeting Attendance',
      description: 'Track and manage offline meeting attendance with ease.',
      icon: <Calendar className="h-8 w-8 text-purple-600" />,
    },
    {
      title: 'Admin Management System',
      description: 'Complete administrative control over users, departments, and batches.',
      icon: <Shield className="h-8 w-8 text-indigo-600" />,
    },
  ];

  const roles = [
    {
      title: 'Admin',
      icon: <Shield className="h-12 w-12 text-purple-600" />,
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
      icon: <Users className="h-12 w-12 text-indigo-600" />,
      features: [
        'Assign tasks and goals',
        'Real-time communication',
        'Track mentee progress',
        'Schedule meetings',
        'Manage offline attendance'
      ]
    },
    {
      title: 'Student',
      icon: <User className="h-12 w-12 text-purple-600" />,
      features: [
        'View assigned tasks',
        'Chat with mentors',
        'Attend virtual sessions',
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

  return (
    <div className="bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 font-sans min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-indigo-100 fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <MenteeConnectLogo size="md" animate />
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#features" className="text-slate-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-all duration-300 relative group">
                  Features
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a href="#roles" className="text-slate-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-all duration-300 relative group">
                  Roles
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a href="#about" className="text-slate-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-all duration-300 relative group">
                  About
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a href="#contact" className="text-slate-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-all duration-300 relative group">
                  Contact
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </a>
                {isAuthenticated ? (
                  <Link
                    to={`/${user.role.toLowerCase()}/dashboard`}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg backdrop-blur-sm"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg backdrop-blur-sm"
                  >
                    Log in
                  </Link>
                )}
              </div>
            </div>
            
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-700 hover:text-purple-600 p-2 rounded-lg hover:bg-purple-50 transition-all"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md shadow-lg border-t border-indigo-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-slate-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all">Features</a>
              <a href="#roles" className="block px-3 py-2 text-slate-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all">Roles</a>
              <a href="#about" className="block px-3 py-2 text-slate-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all">About</a>
              <a href="#contact" className="block px-3 py-2 text-slate-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all">Contact</a>
              {isAuthenticated ? (
                <Link
                  to={`/${user.role.toLowerCase()}/dashboard`}
                  className="block w-full text-left bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-lg mt-2"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="block w-full text-left bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-lg mt-2"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
                Empowering Mentorship,
                <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
                  Simplified.
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                A complete solution for mentor-mentee management, communication, and growth tracking in colleges.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl backdrop-blur-sm"
                >
                  Try Demo
                </Link>
                <button className="border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50 transition-all backdrop-blur-sm">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-indigo-300/30 to-purple-300/30 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-purple-300/30 to-pink-300/30 rounded-full opacity-60 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded-full opacity-70 animate-pulse delay-2000"></div>
      </section>

      {/* About the Application */}
      <section id="about" className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-8">About MenteeConnect</h2>
          <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-indigo-100">
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              MenteeConnect is a comprehensive mentor-mentee management system designed specifically for colleges and educational institutions. 
              This platform bridges the gap between mentors and students by providing intuitive tools for communication, task management, 
              progress tracking, and administrative oversight.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Developed as an individual project by a passionate student developer, MenteeConnect aims to revolutionize how academic 
              mentorship programs are managed and delivered, making the entire process more efficient, transparent, and effective.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-16 bg-gradient-to-br from-slate-50 to-indigo-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">Key Features</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive tools designed to enhance mentorship experience for everyone involved
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-indigo-100/50 group">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl mb-6 group-hover:from-indigo-200 group-hover:to-purple-200 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Access */}
      <section id="roles" className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">Role-Based Access</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Tailored experiences for every user type in your institution
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <div key={index} className="bg-gradient-to-br from-white/80 to-indigo-50/50 backdrop-blur-md p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-indigo-100/50">
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl">
                      {role.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">{role.title}</h3>
                </div>
                <ul className="space-y-3">
                  {role.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-slate-600">
                      <CheckCircle className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Use MenteeConnect */}
      <section className="py-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose MenteeConnect?</h2>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              Built with modern technology and designed for academic excellence
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                <CheckCircle className="h-8 w-8 text-indigo-200 mr-4 flex-shrink-0" />
                <span className="text-white text-lg font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-xl"></div>
      </section>

      {/* Developer Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-purple-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-8">About the Developer</h2>
          <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-indigo-100">
            <div className="w-32 h-32 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
              <User className="h-16 w-16 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Mahesh Shinde</h3>
            <p className="text-lg text-slate-600 mb-6">Student at Sanjivani College of Engineering</p>
            <p className="text-slate-600 leading-relaxed mb-8">
              Passionate about creating innovative solutions for educational technology. 
              MenteeConnect represents my commitment to improving academic mentorship through modern web technologies.
            </p>
            <div className="flex justify-center space-x-6">
              <a href="https://github.com/coder-mahi" className="flex items-center text-slate-600 hover:text-purple-600 transition-all p-3 rounded-lg hover:bg-purple-50">
                <Github className="h-6 w-6 mr-2" />
                GitHub
              </a>
              <a href="www.linkedin.com/in/mahesh-shinde-0a666b23b" className="flex items-center text-slate-600 hover:text-purple-600 transition-all p-3 rounded-lg hover:bg-purple-50">
                <Linkedin className="h-6 w-6 mr-2" />
                LinkedIn
              </a>
              <a href="https://shindemaheshportfolio.netlify.app" className="flex items-center text-slate-600 hover:text-purple-600 transition-all p-3 rounded-lg hover:bg-purple-50">
                <User className="h-6 w-6 mr-2" />
                Portfolio
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">Get in Touch</h2>
            <p className="text-xl text-slate-600">Have questions? Want to collaborate? Let's connect!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-indigo-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-white/50 rounded-lg">
                  <Mail className="h-6 w-6 text-purple-600 mr-4" />
                  <span className="text-slate-700">contact.shindemahesh2112@gmail.com</span>
                </div>
                <div className="flex items-center p-3 bg-white/50 rounded-lg">
                  <MapPin className="h-6 w-6 text-indigo-600 mr-4" />
                  <span className="text-slate-700">Sanjivani College of Engineering</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-purple-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Connect Online</h3>
              <div className="space-y-4">
                <a href="https://github.com/coder-mahi" className="flex items-center text-slate-700 hover:text-purple-600 transition-all p-3 bg-white/50 rounded-lg hover:bg-white/70">
                  <Github className="h-6 w-6 mr-4" />
                  GitHub Profile
                </a>
                <a href="www.linkedin.com/in/mahesh-shinde-0a666b23b" className="flex items-center text-slate-700 hover:text-indigo-600 transition-all p-3 bg-white/50 rounded-lg hover:bg-white/70">
                  <Linkedin className="h-6 w-6 mr-4" />
                  LinkedIn Profile
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Keeping original design */}
      <footer className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-16 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="h-12 w-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-12">
                    <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center transform -rotate-12">
                      <span className="text-indigo-600 font-bold text-lg">M</span>
                    </div>
                  </div>
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full animate-pulse"></div>
                </div>
                <span className="ml-4 text-3xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                  MenteeConnect
                </span>
              </div>
              <p className="text-indigo-200 max-w-md text-lg leading-relaxed">
                Empowering mentorship through technology. Built by students, for students to create meaningful connections.
              </p>
              <div className="flex space-x-4 mt-6">
                <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer backdrop-blur-sm">
                  <Users className="h-5 w-5 text-indigo-300" />
                </div>
                <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer backdrop-blur-sm">
                  <MessageCircle className="h-5 w-5 text-indigo-300" />
                </div>
                <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer backdrop-blur-sm">
                  <Target className="h-5 w-5 text-indigo-300" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#features" className="text-indigo-200 hover:text-white transition-all duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                    Features
                  </a>
                </li>
                <li>
                  <a href="#roles" className="text-indigo-200 hover:text-white transition-all duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                    Roles
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-indigo-200 hover:text-white transition-all duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                    About
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-indigo-200 hover:text-white transition-all duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6 text-white">Support</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-indigo-200 hover:text-white transition-all duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-indigo-200 hover:text-white transition-all duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-indigo-200 hover:text-white transition-all duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-indigo-200 hover:text-white transition-all duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                    Community
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-indigo-700/50 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-indigo-300 text-center md:text-left">
                © 2025 MenteeConnect. Developed by 
                <span className="font-semibold text-white ml-1">Mahesh Shinde</span>
              </p>
              <div className="flex items-center mt-4 md:mt-0 space-x-6">
                <span className="text-indigo-300 text-sm">Made in India</span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-indigo-300 text-sm">All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-xl"></div>
      </footer>
    </div>
  );
};

export default LandingPage;