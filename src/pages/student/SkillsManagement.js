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
        return 'badge-success';
      case 'ADVANCED':
        return 'badge-brand';
      case 'INTERMEDIATE':
        return 'badge-warn';
      default:
        return 'badge-neutral';
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Skill Form */}
      <div className="card card-pad">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="section-title">Add New Skill</h3>
            <p className="page-subtitle">
              Add a new skill to your profile to showcase your abilities.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={handleAddSkill}>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-4">
                  <label htmlFor="skill-name" className="label">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    name="skill-name"
                    id="skill-name"
                    required
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    className="input"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="proficiency" className="label">
                    Proficiency Level
                  </label>
                  <select
                    id="proficiency"
                    name="proficiency"
                    value={newSkill.proficiency}
                    onChange={(e) => setNewSkill({ ...newSkill, proficiency: e.target.value })}
                    className="select"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                    <option value="EXPERT">Expert</option>
                  </select>
                </div>

                <div className="col-span-6">
                  <label htmlFor="description" className="label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={newSkill.description}
                    onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                    className="textarea"
                    placeholder="Describe your experience with this skill..."
                  />
                </div>
              </div>
              <div className="mt-5">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Adding...' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Skills List */}
      <div className="card overflow-hidden">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-slate-700/70 sm:px-6">
          <h3 className="section-title">Your Skills</h3>
        </div>
        <ul className="divide-y divide-gray-100 dark:divide-slate-700/60">
          {skills.map((skill) => (
            <li key={skill.id} className="px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="truncate text-sm font-medium text-brand-600 dark:text-brand-400">{skill.name}</h4>
                  <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{skill.description}</p>
                </div>
                <div className="ml-4">
                  <span
                    className={`${getProficiencyColor(
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