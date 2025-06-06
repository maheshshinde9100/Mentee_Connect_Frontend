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
      url: 'https://www.linkedin.com/in/mahesh-shinde-0a666b23b',
      icon: '/linkedin.svg',
      color: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/coder-mahi',
      icon: '/github.svg',
      color: 'bg-gray-50 text-gray-700 hover:bg-gray-100',
    },
    {
      name: 'Portfolio',
      url: 'https://shindemaheshportfolio.netlify.app',
      icon: '/portfolio.svg',
      color: 'bg-purple-50 text-purple-700 hover:bg-purple-100',
    },
    {
      name: 'HackerRank',
      url: 'https://www.hackerrank.com/maheshshinde9100',
      icon: '/hackerrank.svg',
      color: 'bg-green-50 text-green-700 hover:bg-green-100',
    },
    {
      name: 'LeetCode',
      url: 'https://leetcode.com/code-with-mahesh',
      icon: '/leetcode.svg',
      color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100',
    },
    {
      name: 'CodeChef',
      url: 'https://www.codechef.com/users/coder_mahi',
      icon: '/codechef.svg',
      color: 'bg-orange-50 text-orange-700 hover:bg-orange-100',
    },
    {
      name: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/user/coder_mahi',
      icon: '/gfg.svg',
      color: 'bg-green-50 text-green-700 hover:bg-green-100',
    },
    {
      name:'StackOverflow',
      url:'https://stackoverflow.com/users/22119667/mahesh-shinde',
      icon:'/gfg.svg',
      color:'bg-gray-50 text-gray-700 hover:bg-gray-100',
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Me</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            I'm always open to new opportunities, collaborations, or even just a tech talk. Feel free to get in touch!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Get in Touch</h2>
            
            <div className="space-y-8">
              {/* Email */}
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <EnvelopeIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium text-gray-900">Email</p>
                  <a href={`mailto:${contactInfo.email}`} className="text-indigo-600 hover:text-indigo-500">
                    {contactInfo.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <PhoneIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium text-gray-900">Phone</p>
                  <a href={`tel:${contactInfo.phone}`} className="text-indigo-600 hover:text-indigo-500">
                    {contactInfo.phone}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <MapPinIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium text-gray-900">Location</p>
                  <p className="text-gray-600">{contactInfo.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send a Message</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="What is this about?"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Your message here..."
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Social Profiles Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Online Profiles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {socialProfiles.map((profile) => (
              <a
                key={profile.name}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center p-4 rounded-lg transition-colors duration-200 ${profile.color}`}
              >
                <GlobeAltIcon className="h-5 w-5 mr-3" />
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