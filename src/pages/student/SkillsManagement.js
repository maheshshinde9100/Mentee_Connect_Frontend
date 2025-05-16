import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/api';

const SkillsManagement = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({
    name: '',
    proficiency: 'BEGINNER',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await studentService.getSkills();
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await studentService.addSkill(newSkill);
      setNewSkill({ name: '', proficiency: 'BEGINNER', description: '' });
      fetchSkills();
    } catch (error) {
      console.error('Error adding skill:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProficiencyColor = (proficiency) => {
    switch (proficiency) {
      case 'EXPERT':
        return 'bg-green-100 text-green-800';
      case 'ADVANCED':
        return 'bg-blue-100 text-blue-800';
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Skill Form */}
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Add New Skill</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add a new skill to your profile to showcase your abilities.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={handleAddSkill}>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-4">
                  <label htmlFor="skill-name" className="block text-sm font-medium text-gray-700">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    name="skill-name"
                    id="skill-name"
                    required
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="proficiency" className="block text-sm font-medium text-gray-700">
                    Proficiency Level
                  </label>
                  <select
                    id="proficiency"
                    name="proficiency"
                    value={newSkill.proficiency}
                    onChange={(e) => setNewSkill({ ...newSkill, proficiency: e.target.value })}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                    <option value="EXPERT">Expert</option>
                  </select>
                </div>

                <div className="col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={newSkill.description}
                    onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Describe your experience with this skill..."
                  />
                </div>
              </div>
              <div className="mt-5">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? 'Adding...' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Skills List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Your Skills</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {skills.map((skill) => (
            <li key={skill.id} className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-indigo-600 truncate">{skill.name}</h4>
                  <p className="mt-1 text-sm text-gray-500">{skill.description}</p>
                </div>
                <div className="ml-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProficiencyColor(
                      skill.proficiency
                    )}`}
                  >
                    {skill.proficiency.toLowerCase()}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SkillsManagement; 