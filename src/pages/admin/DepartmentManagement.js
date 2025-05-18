import React from 'react';
import { BuildingLibraryIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

const DepartmentManagement = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <BuildingLibraryIcon className="h-24 w-24 text-indigo-600" />
              <WrenchScrewdriverIcon className="h-12 w-12 text-yellow-500 absolute -bottom-2 -right-2 animate-bounce" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Department Management
          </h1>
          
          <div className="bg-indigo-50 rounded-lg p-6 mb-8">
            <p className="text-xl text-indigo-900 font-medium">
              🚧 This Feature is Under Development 🚧
            </p>
          </div>
          
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            We're working hard to bring you a comprehensive department management system. 
            This feature will allow you to:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
                className="bg-white p-6 rounded-lg border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 bg-gray-50 rounded-lg p-6">
            <p className="text-sm text-gray-500">
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