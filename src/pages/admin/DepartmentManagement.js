import React from 'react';
import { BuildingLibraryIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

const DepartmentManagement = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 dark:bg-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <div className="card card-pad md:p-12">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <BuildingLibraryIcon className="h-24 w-24 text-brand-600 dark:text-brand-400" />
              <WrenchScrewdriverIcon className="absolute -bottom-2 -right-2 h-12 w-12 text-amber-500" />
            </div>
          </div>
          
          <h1 className="page-title mb-4">
            Department Management
          </h1>
          
          <div className="mb-8 rounded-xl border border-brand-200 bg-brand-50 p-6 dark:border-brand-900/50 dark:bg-brand-950/30">
            <p className="text-xl font-medium text-brand-700 dark:text-brand-300">
              This Feature is Under Development
            </p>
          </div>
          
          <p className="muted mx-auto mb-8 max-w-2xl">
            We're working hard to bring you a comprehensive department management system. 
            This feature will allow you to:
          </p>
          
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Department Creation',
                description: 'Create and manage different academic departments'
              },
              {
                title: 'Course Management',
                description: 'Organize courses within departments'
              },
              {
                title: 'Staff Assignment',
                description: 'Assign staff members to departments'
              },
              {
                title: 'Resource Allocation',
                description: 'Manage departmental resources efficiently'
              },
              {
                title: 'Performance Tracking',
                description: 'Monitor department-wise performance metrics'
              },
              {
                title: 'Reports Generation',
                description: 'Generate detailed departmental reports'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="card card-pad card-hover text-left"
              >
                <h3 className="section-title mb-2">
                  {feature.title}
                </h3>
                <p className="muted">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-slate-700/70 dark:bg-slate-800/50">
            <p className="muted text-sm">
              Expected completion: Q3 2024
              <br />
              Thank you for your patience while we develop this feature.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentManagement; 