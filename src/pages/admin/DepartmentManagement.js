import React, { useEffect, useMemo, useState } from 'react';
import { BuildingLibraryIcon, UserGroupIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import adminService from '../../services/adminService';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await adminService.getAllDepartments();
        setDepartments(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (err) {
        console.error('Failed to load departments', err);
        setError('Unable to load department statistics right now.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totals = useMemo(
    () =>
      departments.reduce(
        (acc, dept) => ({
          mentors: acc.mentors + (dept.mentorCount || 0),
          students: acc.students + (dept.studentCount || 0),
          people: acc.people + (dept.total || 0),
        }),
        { mentors: 0, students: 0, people: 0 }
      ),
    [departments]
  );

  const cards = [
    { title: 'Departments', value: departments.length, icon: BuildingLibraryIcon },
    { title: 'Mentors', value: totals.mentors, icon: UserGroupIcon },
    { title: 'Students', value: totals.students, icon: AcademicCapIcon },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Departments</h1>
        <p className="page-subtitle">
          Department coverage across mentors and students. Updates automatically as people are added or edited.
        </p>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {cards.map((card) => (
          <div key={card.title} className="card card-pad">
            <div className="flex items-center">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                <card.icon className="h-5 w-5" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{card.title}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3 dark:border-slate-700/70">
          <h2 className="section-title">Department breakdown</h2>
          {loading && <span className="muted text-xs">Loading...</span>}
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Mentors</th>
                <th>Students</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {!loading && departments.length === 0 && (
                <tr>
                  <td colSpan={4} className="muted text-center">
                    No departments found. Add mentors or students with a department first.
                  </td>
                </tr>
              )}
              {departments.map((dept) => (
                <tr key={dept.name}>
                  <td className="font-medium text-gray-900 dark:text-white">{dept.name}</td>
                  <td>{dept.mentorCount ?? 0}</td>
                  <td>{dept.studentCount ?? 0}</td>
                  <td>{dept.total ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DepartmentManagement;
