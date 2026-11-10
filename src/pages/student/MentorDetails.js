import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/api';

const MentorDetails = () => {
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMentorDetails();
  }, []);

  const fetchMentorDetails = async () => {
    try {
      setLoading(true);
      const response = await studentService.getAssignedMentor();
      setMentor(response.data);
    } catch (error) {
      console.error('Error fetching mentor details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400" />
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="alert-warn">
        <svg className="h-5 w-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <p className="text-sm">
          No mentor has been assigned to you yet.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-pad border-b border-gray-200 dark:border-slate-700/70">
        <h3 className="section-title">Mentor Information</h3>
        <p className="page-subtitle">Details about your assigned mentor.</p>
      </div>
      <dl className="divide-y divide-gray-100 px-5 dark:divide-slate-700/60 sm:px-6">
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Full name</dt>
          <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{mentor.name}</dd>
        </div>
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Email address</dt>
          <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{mentor.email}</dd>
        </div>
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Expertise</dt>
          <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
            {mentor.expertise?.join(', ') || 'Not specified'}
          </dd>
        </div>
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Experience</dt>
          <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
            {mentor.experience || 'Not specified'}
          </dd>
        </div>
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Office hours</dt>
          <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
            {mentor.officeHours || 'Not specified'}
          </dd>
        </div>
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Contact information</dt>
          <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
            <ul className="divide-y divide-gray-200 rounded-xl border border-gray-200 dark:divide-slate-700 dark:border-slate-700">
              {mentor.contactMethods?.map((contact, index) => (
                <li key={index} className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                  <div className="flex w-0 flex-1 items-center">
                    <span className="ml-2 w-0 flex-1 truncate">{contact.type}: {contact.value}</span>
                  </div>
                </li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default MentorDetails; 