import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="border-b border-gray-200 bg-white dark:border-slate-700/70 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow">Mentee Connect</p>
            <h1 className="page-title mt-2">
              <span className="block">Transform Your</span>
              <span className="block text-brand-600 dark:text-brand-400">Academic Journey</span>
            </h1>
            <p className="page-subtitle mt-4 text-base sm:text-lg">
              Connect with experienced mentors who can guide you through your academic and career path. Get personalized mentoring sessions and grow your skills.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/login" className="btn-primary btn-lg">
                Get Started
              </Link>
              <Link to="/mentors" className="btn-secondary btn-lg">
                Browse Mentors
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow">Features</p>
            <h2 className="page-title mt-2">
              Everything you need to succeed
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                title: 'Expert Mentors',
                description: 'Connect with experienced mentors from top institutions and industries.'
              },
              {
                title: 'Flexible Sessions',
                description: 'Schedule one-on-one sessions at times that work best for you.'
              },
              {
                title: 'Track Progress',
                description: 'Monitor your growth with detailed progress tracking and feedback.'
              }
            ].map((feature) => (
              <div key={feature.title} className="card card-pad">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                <h3 className="mt-4 section-title">{feature.title}</h3>
                <p className="mt-2 muted text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
