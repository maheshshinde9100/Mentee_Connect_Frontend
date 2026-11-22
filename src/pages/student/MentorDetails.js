import React, { useState, useEffect } from 'react';
import { VideoCameraIcon } from '@heroicons/react/24/outline';
import studentService from '../../services/studentService';
import { useCall } from '../../context/CallContext';

const MentorDetails = () => {
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [calling, setCalling] = useState(false);
  const { startCall } = useCall() || {};

  useEffect(() => {
    fetchMentorDetails();
  }, []);

  const fetchMentorDetails = async () => {
    try {
      setLoading(true);
      const response = await studentService.getMyMentor();
      setMentor(response.data);
      setError(null);
    } catch (err) {
      setError('Could not load your mentor details.');
      setMentor(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCallMentor = async () => {
    if (!mentor?.id || !startCall) return;
    try {
      setCalling(true);
      const name = [mentor.firstName, mentor.lastName].filter(Boolean).join(' ');
      await startCall([mentor.id], `Call with ${name || 'mentor'}`);
    } finally {
      setCalling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400" />
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="alert-warn">
        <p className="text-sm">{error || 'No mentor has been assigned to you yet.'}</p>
      </div>
    );
  }

  const fullName = [mentor.firstName, mentor.lastName].filter(Boolean).join(' ') || 'Mentor';

  return (
    <div className="card">
      <div className="card-pad flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 dark:border-slate-700/70">
        <div>
          <h3 className="section-title">Mentor Information</h3>
          <p className="page-subtitle">Details about your assigned mentor.</p>
        </div>
        <button
          type="button"
          onClick={handleCallMentor}
          disabled={!mentor.id || calling}
          className="btn-primary inline-flex items-center gap-2"
        >
          <VideoCameraIcon className="h-5 w-5" />
          {calling ? 'Starting...' : 'Start video call'}
        </button>
      </div>
      <dl className="divide-y divide-gray-100 px-5 dark:divide-slate-700/60 sm:px-6">
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Full name</dt>
          <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">{fullName}</dd>
        </div>
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Email address</dt>
          <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">{mentor.email || 'Not specified'}</dd>
        </div>
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Phone number</dt>
          <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">{mentor.phoneNumber || 'Not specified'}</dd>
        </div>
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Department</dt>
          <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">{mentor.department || 'Not specified'}</dd>
        </div>
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Specialization</dt>
          <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">{mentor.specialization || 'Not specified'}</dd>
        </div>
      </dl>
    </div>
  );
};

export default MentorDetails;
