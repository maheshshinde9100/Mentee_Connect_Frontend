// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import logo from '../logo.svg';

// const LandingPage = () => {
//   const { isAuthenticated, user } = useAuth();

//   const features = [
//     {
//       title: 'Academic Excellence',
//       description: 'Get personalized guidance to improve your academic performance and track your progress throughout your college journey.',
//       icon: (
//         <svg className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0L3 9m9 5v6m0-6l9-5" />
//         </svg>
//       ),
//     },
//     {
//       title: 'Mentoring Sessions',
//       description: 'Regular one-on-one sessions with mentors to discuss academic progress and receive guidance.',
//       icon: (
//         <svg className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//         </svg>
//       ),
//     },
//     {
//       title: 'Academic Resources',
//       description: 'Access to study materials and resources shared by mentors to support your academic learning.',
//       icon: (
//         <svg className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//         </svg>
//       ),
//     },
//   ];

//   return (
//     <div className="bg-white">
//       {/* Hero Section */}
//       <div className="relative overflow-hidden">
//         <div className="absolute inset-y-0 h-full w-full" aria-hidden="true">
//           <div className="relative h-full">
//             <svg
//               className="absolute right-full transform translate-y-1/3 translate-x-1/4 md:translate-y-1/2 sm:translate-x-1/2 lg:translate-x-full"
//               width="404"
//               height="784"
//               fill="none"
//               viewBox="0 0 404 784"
//             >
//               <defs>
//                 <pattern
//                   id="e229dbec-10e9-49ee-8ec3-0286ca089edf"
//                   x="0"
//                   y="0"
//                   width="20"
//                   height="20"
//                   patternUnits="userSpaceOnUse"
//                 >
//                   <rect x="0" y="0" width="4" height="4" className="text-gray-200" fill="currentColor" />
//                 </pattern>
//               </defs>
//               <rect width="404" height="784" fill="url(#e229dbec-10e9-49ee-8ec3-0286ca089edf)" />
//             </svg>
//             <svg
//               className="absolute left-full transform -translate-y-3/4 -translate-x-1/4 sm:-translate-x-1/2 md:-translate-y-1/2 lg:-translate-x-3/4"
//               width="404"
//               height="784"
//               fill="none"
//               viewBox="0 0 404 784"
//             >
//               <defs>
//                 <pattern
//                   id="d2a68204-c383-44b1-b99f-42ccff4e5365"
//                   x="0"
//                   y="0"
//                   width="20"
//                   height="20"
//                   patternUnits="userSpaceOnUse"
//                 >
//                   <rect x="0" y="0" width="4" height="4" className="text-gray-200" fill="currentColor" />
//                 </pattern>
//               </defs>
//               <rect width="404" height="784" fill="url(#d2a68204-c383-44b1-b99f-42ccff4e5365)" />
//             </svg>
//           </div>
//         </div>

//         <div className="relative pt-6 pb-16 sm:pb-24">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6">
//             <nav className="relative flex items-center justify-between sm:h-10 md:justify-center">
//               <div className="flex items-center flex-1 md:absolute md:inset-y-0 md:left-0">
//                 <div className="flex items-center justify-between w-full md:w-auto">
//                   <Link to="/">
//                     <span className="sr-only">MenteeConnect</span>
//                     <img
//                       className="h-8 w-auto sm:h-10"
//                       src={logo}
//                       alt="MenteeConnect"
//                     />
//                   </Link>
//                 </div>
//               </div>
//               <div className="hidden md:flex md:space-x-10">
//                 <a href="#features" className="font-medium text-gray-500 hover:text-gray-900">
//                   Features
//                 </a>
//                 <Link to="/about" className="font-medium text-gray-500 hover:text-gray-900">
//                   About
//                 </Link>
//                 <Link to="/contact" className="font-medium text-gray-500 hover:text-gray-900">
//                   Contact
//                 </Link>
//               </div>
//               <div className="hidden md:absolute md:flex md:items-center md:justify-end md:inset-y-0 md:right-0">
//                 {isAuthenticated ? (
//                   <Link
//                     to={`/${user.role.toLowerCase()}/dashboard`}
//                     className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
//                   >
//                     Go to Dashboard
//                   </Link>
//                 ) : (
//                   <span className="inline-flex rounded-md shadow">
//                     <Link
//                       to="/login"
//                       className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
//                     >
//                       Log in
//                     </Link>
//                   </span>
//                 )}
//               </div>
//             </nav>
//           </div>

//           <div className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6">
//             <div className="text-center">
//               <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
//                 <span className="block">MenteeConnect</span>
//                 <span className="block text-indigo-600">Student Mentoring System</span>
//               </h1>
//               <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
//                 A digital platform designed to enhance academic performance through personalized mentoring and guidance.
//               </p>
//               <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
//                 <div className="rounded-md shadow">
//                   <Link
//                     to="/login"
//                     className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
//                   >
//                     Login to Access
//                   </Link>
//                 </div>
//                 <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
//                   <Link
//                     to="/about"
//                     className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
//                   >
//                     Learn More
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Features Section */}
//       <div id="features" className="py-12 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="lg:text-center">
//             <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Platform Features</h2>
//             <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
//               Comprehensive Mentoring Support
//             </p>
//             <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
//               Our platform provides all the tools needed for effective mentoring, progress tracking, and communication between students and mentors.
//             </p>
//           </div>

//           <div className="mt-10">
//             <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
//               {features.map((feature) => (
//                 <div key={feature.title} className="relative">
//                   <dt>
//                     <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
//                       {feature.icon}
//                     </div>
//                     <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.title}</p>
//                   </dt>
//                   <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
//                 </div>
//               ))}
//             </dl>
//           </div>
//         </div>
//       </div>

//       {/* CTA Section */}
//       <div className="bg-indigo-50">
//         <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
//           <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
//             <span className="block">Ready to access your mentoring platform?</span>
//             <span className="block text-indigo-600">Login to get started.</span>
//           </h2>
//           <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
//             <div className="inline-flex rounded-md shadow">
//               <Link
//                 to="/login"
//                 className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
//               >
//                 Login
//               </Link>
//             </div>
//             <div className="ml-3 inline-flex rounded-md shadow">
//               <Link
//                 to="/contact"
//                 className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
//               >
//                 Contact Support
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;

import React, { useState } from 'react';
import { User, Users, Shield, MessageSquare, Calendar, Target, Bell, Video, TrendingUp, CheckCircle, Github, Linkedin, Mail, MapPin, Menu, X, MessageCircle  } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// Replace this import with your actual application icon
import logo from '../logo.svg'; // <-- PUT YOUR APPLICATION ICON HERE

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      title: 'Task & Goal Assignment',
      description: 'Create, assign, and track personalized tasks and goals for each mentee.',
      icon: <Target className="h-8 w-8 text-indigo-600" />,
    },
    {
      title: 'Real-time Chat & Notifications',
      description: 'Instant messaging and smart notifications to keep everyone connected.',
      icon: <MessageSquare className="h-8 w-8 text-indigo-600" />,
    },
    {
      title: 'Video Call Integration',
      description: 'Built-in video calling for seamless virtual mentoring sessions.',
      icon: <Video className="h-8 w-8 text-indigo-600" />,
    },
    {
      title: 'Progress Tracking',
      description: 'Comprehensive analytics and progress monitoring for mentees.',
      icon: <TrendingUp className="h-8 w-8 text-indigo-600" />,
    },
    {
      title: 'Offline Meeting Attendance',
      description: 'Track and manage offline meeting attendance with ease.',
      icon: <Calendar className="h-8 w-8 text-indigo-600" />,
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
      icon: <Shield className="h-12 w-12 text-indigo-600" />,
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
      icon: <User className="h-12 w-12 text-indigo-600" />,
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
    <div className="bg-white font-sans">
      {/* Navigation */}
      <nav className="bg-white shadow-lg fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img
                  className="h-10 w-auto"
                  src={logo}
                  alt="MenteeConnect"
                />
                <span className="ml-3 text-2xl font-bold text-indigo-600">
                  MenteeConnect
                </span>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#features" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors">Features</a>
                <a href="#roles" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors">Roles</a>
                <a href="#about" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors">About</a>
                <a href="#contact" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors">Contact</a>
                {isAuthenticated ? (
                  <Link
                    to={`/${user.role.toLowerCase()}/dashboard`}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105"
                  >
                    Log in
                  </Link>
                )}
              </div>
            </div>
            
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-indigo-600"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Features</a>
              <a href="#roles" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Roles</a>
              <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">About</a>
              <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Contact</a>
              {isAuthenticated ? (
                <Link
                  to={`/${user.role.toLowerCase()}/dashboard`}
                  className="block w-full text-left bg-indigo-600 text-white px-3 py-2 rounded-lg mt-2"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="block w-full text-left bg-indigo-600 text-white px-3 py-2 rounded-lg mt-2"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Empowering Mentorship,
                <span className="block text-indigo-600">
                  Simplified.
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                A complete solution for mentor-mentee management, communication, and growth tracking in colleges.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/login"
                  className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Try Demo
                </Link>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-indigo-600 hover:text-indigo-600 transition-all">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-indigo-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-indigo-300 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-indigo-400 rounded-full opacity-30 animate-pulse delay-2000"></div>
      </section>

      {/* About the Application */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">About MenteeConnect</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            MenteeConnect is a comprehensive mentor-mentee management system designed specifically for colleges and educational institutions. 
            This platform bridges the gap between mentors and students by providing intuitive tools for communication, task management, 
            progress tracking, and administrative oversight.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Developed as an individual project by a passionate student developer, MenteeConnect aims to revolutionize how academic 
            mentorship programs are managed and delivered, making the entire process more efficient, transparent, and effective.
          </p>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools designed to enhance mentorship experience for everyone involved
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-lg mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Access */}
      <section id="roles" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Role-Based Access</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored experiences for every user type in your institution
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    {role.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{role.title}</h3>
                </div>
                <ul className="space-y-3">
                  {role.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <CheckCircle className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
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
      <section className="py-16 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose MenteeConnect?</h2>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              Built with modern technology and designed for academic excellence
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
                <CheckCircle className="h-8 w-8 text-indigo-200 mr-4 flex-shrink-0" />
                <span className="text-white text-lg font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">About the Developer</h2>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-32 h-32 bg-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <User className="h-16 w-16 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Mahesh Shinde</h3>
            <p className="text-lg text-gray-600 mb-6">Student at Sanjivani College of Engineering</p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Passionate about creating innovative solutions for educational technology. 
              MenteeConnect represents my commitment to improving academic mentorship through modern web technologies.
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors">
                <Github className="h-6 w-6 mr-2" />
                GitHub
              </a>
              <a href="#" className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors">
                <Linkedin className="h-6 w-6 mr-2" />
                LinkedIn
              </a>
              <a href="#" className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors">
                <User className="h-6 w-6 mr-2" />
                Portfolio
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600">Have questions? Want to collaborate? Let's connect!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-indigo-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-6 w-6 text-indigo-600 mr-4" />
                  <span className="text-gray-700">mahesh.shinde@example.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-6 w-6 text-indigo-600 mr-4" />
                  <span className="text-gray-700">Sanjivani College of Engineering</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Connect Online</h3>
              <div className="space-y-4">
                <a href="#" className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors">
                  <Github className="h-6 w-6 mr-4" />
                  GitHub Profile
                </a>
                <a href="#" className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors">
                  <Linkedin className="h-6 w-6 mr-4" />
                  LinkedIn Profile
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

{/* Footer */}
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