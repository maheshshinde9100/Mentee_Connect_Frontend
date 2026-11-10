import React from 'react';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

const Contact = () => {
  const contactInfo = {
    email: 'contact.shindemahesh2112@gmail.com',
    phone: '+91 95295 44681',
    location: 'Undirwadi, Yeola Taluka, Nashik District, Maharashtra – 423402, India',
  };
  const socialProfiles = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/maheshshinde9100',
      icon: '/linkedin.svg',
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/maheshshinde9100',
      icon: '/github.svg',
      color: 'bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600',
    },
    {
      name: 'Portfolio',
      url: 'https://maheshshinde-dev.vercel.app',
      icon: '/portfolio.svg',
      color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40',
    },
    {
      name: 'HackerRank',
      url: 'https://www.hackerrank.com/maheshshinde9100',
      icon: '/hackerrank.svg',
      color: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40',
    },
    {
      name: 'LeetCode',
      url: 'https://leetcode.com/code-with-mahesh',
      icon: '/leetcode.svg',
      color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/40',
    },
    {
      name: 'CodeChef',
      url: 'https://www.codechef.com/users/coder_mahi',
      icon: '/codechef.svg',
      color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/40',
    },
    {
      name: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/user/coder_mahi',
      icon: '/gfg.svg',
      color: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40',
    },
    {
      name: 'StackOverflow',
      url: 'https://stackoverflow.com/users/22119667/mahesh-shinde',
      icon: '/gfg.svg',
      color: 'bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600',
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <p className="eyebrow">Contact</p>
          <h1 className="page-title mt-2">Contact Me</h1>
          <p className="page-subtitle max-w-2xl mx-auto">
            I'm always open to new opportunities, collaborations, or even just a tech talk. Feel free to get in touch!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="card card-pad">
            <h2 className="section-title mb-6">Get in Touch</h2>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                    <EnvelopeIcon className="h-5 w-5" />
                  </span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                  <a href={`mailto:${contactInfo.email}`} className="link break-all">
                    {contactInfo.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                    <PhoneIcon className="h-5 w-5" />
                  </span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Phone</p>
                  <a href={`tel:${contactInfo.phone}`} className="link">
                    {contactInfo.phone}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                    <MapPinIcon className="h-5 w-5" />
                  </span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Location</p>
                  <p className="muted text-sm">{contactInfo.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card card-pad">
            <h2 className="section-title mb-6">Send a Message</h2>
            <form className="space-y-5">
              <div>
                <label htmlFor="name" className="label">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="input"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="input"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="label">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="input"
                  placeholder="What is this about?"
                />
              </div>
              <div>
                <label htmlFor="message" className="label">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="textarea"
                  placeholder="Your message here..."
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="btn-primary w-full"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Social Profiles Section */}
        <div className="card card-pad">
          <h2 className="section-title mb-6">Online Profiles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {socialProfiles.map((profile) => (
              <a
                key={profile.name}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card card-hover flex items-center px-4 py-3 text-gray-700 dark:text-slate-300"
              >
                <GlobeAltIcon className="h-5 w-5 mr-2 text-brand-600 dark:text-brand-400" />
                <span className="font-medium">{profile.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
