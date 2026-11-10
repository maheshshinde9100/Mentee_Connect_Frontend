import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  AcademicCapIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ChartBarIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import studentService from '../../services/studentService';

import CertificateManagement from '../../components/CertificateManagement';

const StudentDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [mentor, setMentor] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (user && user.id) {
      fetchProfile();
      fetchMentor();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await studentService.getCurrentProfile();
      setProfile(response.data);
    } catch (err) {
      setError('Failed to fetch profile');
      console.error('Error fetching profile:', err);
    }
  };

  const fetchMentor = async () => {
    try {
      const response = await studentService.getMyMentor();
      setMentor(response.data);
    } catch (err) {
      setError('Failed to fetch mentor details');
      console.error('Error fetching mentor:', err);
    }
  };


  const statsCards = [
    {
      title: 'Course',
      value: profile?.course || 'Not Set',
      description: 'Current Course',
      icon: AcademicCapIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Semester',
      value: profile?.semester || 'Not Set',
      description: 'Current Semester',
      icon: BookOpenIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Attendance',
      value: `${profile?.attendance || 0}%`,
      description: 'Overall attendance',
      icon: ChartBarIcon,
      color: 'bg-purple-500',
    },
    {
      title: 'CGPA',
      value: profile?.cgpa || '0.0',
      description: 'Current CGPA',
      icon: ChartBarIcon,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="py-6">
      {/* Student Info Header */}
      <div className="px-4 sm:px-6 md:px-8 mb-6">
        <div className="card card-pad">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-2xl font-semibold text-white">
                {profile?.firstName?.[0]}{profile?.lastName?.[0]}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {profile?.firstName} {profile?.lastName}
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-slate-400">
                  <div className="flex items-center">
                    <AcademicCapIcon className="h-5 w-5 mr-2" />
                    <span>{profile?.course}</span>
                  </div>
                  <div className="flex items-center">
                    <UserGroupIcon className="h-5 w-5 mr-2" />
                    <span>Batch {profile?.batch}</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 mr-2" />
                    <span>Semester {profile?.semester}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 sm:px-6 md:px-8 mb-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((card) => (
            <div
              key={card.title}
              className="card card-pad card-hover"
            >
              <div className="flex items-center">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                  <card.icon className="h-5 w-5" />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-slate-400">
                      {card.title}
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {card.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mentor Information */}
      {mentor && (
        <div className="px-4 sm:px-6 md:px-8 mb-6">
          <div className="card card-pad">
            <h2 className="section-title mb-4">Mentor Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  <span className="font-medium text-gray-700 dark:text-slate-300">Name:</span> {mentor.firstName} {mentor.lastName}
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  <span className="font-medium text-gray-700 dark:text-slate-300">Email:</span> {mentor.email}
                </p>
                {mentor.phoneNumber && (
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    <span className="font-medium text-gray-700 dark:text-slate-300">Phone:</span> {mentor.phoneNumber}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  <span className="font-medium text-gray-700 dark:text-slate-300">Department:</span> {mentor.department}
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  <span className="font-medium text-gray-700 dark:text-slate-300">Specialization:</span> {mentor.specialization}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Certificate Management */}
      <div className="px-4 sm:px-6 md:px-8">
        <CertificateManagement />
      </div>
    </div>
  );
};

export default StudentDashboard;