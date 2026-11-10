import React, { useState } from 'react';

const Mentors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('all');

  // Mock data - In real app, this would come from your Spring Boot backend
  const mentors = [
    {
      id: 1,
      name: "Dr. Sarah Wilson",
      title: "Senior Software Engineer",
      expertise: ["Web Development", "System Design"],
      rating: 4.9,
      totalSessions: 156,
      image: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      id: 2,
      name: "Prof. James Miller",
      title: "Data Science Lead",
      expertise: ["Machine Learning", "Data Analytics"],
      rating: 4.8,
      totalSessions: 98,
      image: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      id: 3,
      name: "Dr. Emily Chen",
      title: "Cloud Architecture Specialist",
      expertise: ["Cloud Computing", "DevOps"],
      rating: 4.7,
      totalSessions: 124,
      image: "https://randomuser.me/api/portraits/women/2.jpg"
    }
  ];

  const expertiseCategories = [
    "all",
    "Web Development",
    "System Design",
    "Machine Learning",
    "Data Analytics",
    "Cloud Computing",
    "DevOps"
  ];

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExpertise = selectedExpertise === 'all' || mentor.expertise.includes(selectedExpertise);
    return matchesSearch && matchesExpertise;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <p className="eyebrow">Mentors</p>
          <h1 className="page-title mt-2">Find Your Perfect Mentor</h1>
          <p className="page-subtitle">
            Connect with industry experts who can guide you through your journey
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search mentors..."
              className="input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="sm:w-64">
            <select
              className="select"
              value={selectedExpertise}
              onChange={(e) => setSelectedExpertise(e.target.value)}
            >
              {expertiseCategories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Expertise' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMentors.map(mentor => (
            <div key={mentor.id} className="card card-pad card-hover">
              <div className="flex items-center">
                <img
                  className="h-16 w-16 rounded-full object-cover"
                  src={mentor.image}
                  alt={mentor.name}
                  loading="lazy"
                  decoding="async"
                />
                <div className="ml-4">
                  <h3 className="section-title">{mentor.name}</h3>
                  <p className="muted text-sm">{mentor.title}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 muted text-sm">{mentor.rating} ({mentor.totalSessions} sessions)</span>
                </div>
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map(skill => (
                      <span
                        key={skill}
                        className="badge-neutral"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button className="btn-primary w-full">
                  Schedule Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mentors;
