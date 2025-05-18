import React from 'react';
import { 
  AcademicCapIcon, 
  BriefcaseIcon, 
  CodeBracketIcon,
  GlobeAltIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

const About = () => {
  const personalInfo = {
    name: 'Mahesh Shinde',
    title: 'Full Stack Java & Android Developer',
    bio: 'A passionate and self-driven developer with a strong interest in Android and web development. I enjoy building creative digital solutions and continuously exploring new technologies to enhance my skills.',
    photo: '/mahesh.png', 
  };

  const education = [
    {
      school: 'Sanjivani College of Engineering, Kopargaon',
      degree: 'B.Tech in Computer Engineering',
      status: 'Currently Pursuing',
    },
    {
      school: 'Sanjivani KBP Polytechnic, Kopargaon',
      degree: 'Diploma in Computer Technology',
      score: '92.82% (Final Semester)',
    },
    {
      school: 'New English School, Undirwadi',
      degree: '10th (SSC)',
      score: '89.40%',
    },
  ];

  const skills = [
    { 
      category: 'Frontend', 
      items: ['HTML', 'CSS', 'JavaScript', 'Tailwind CSS','React.js', 'UI/UX Design'] 
    },
    { 
      category: 'Backend', 
      items: ['Java', 'Spring Boot','Hibernate','Spring Security', 'Node.js (basics)'] 
    },
    { 
      category: 'Android Development', 
      items: ['Java', 'XML','Retrofit'] 
    },
    { 
      category: 'Others', 
      items: ['C++', 'Python (basics)', 'Git & GitHub', 'SQL', 'MongoDB','Firebase'] 
    },
  ];

  const links = [
    {
      name: 'Portfolio',
      url: 'https://shindemaheshportfolio.netlify.app/',
    },
    {
      name: 'Resume',
      url: 'https://maheshshinde9100.hackerresume.io/cdbe784f-7325-4ca3-a047-9a2c4ec314cc',
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/mahesh-shinde-0a666b23b',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/coder-mahi',
    },
    {
      name: 'HackerRank',
      url: 'https://www.hackerrank.com/profile/maheshshinde9100',
    },
    {
      name: 'LeetCode',
      url: 'https://leetcode.com/u/code-with-mahesh/',
    },
    {
      name: 'CodeChef',
      url: 'https://www.codechef.com/users/coder_mahi',
    },
    {
      name: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/user/coder_mahi/',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <img
              src={personalInfo.photo}
              alt={personalInfo.name}
              className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-indigo-600"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{personalInfo.name}</h1>
          <p className="text-xl text-indigo-600 mb-4">{personalInfo.title}</p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{personalInfo.bio}</p>
        </div>

        {/* Education Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <AcademicCapIcon className="h-8 w-8 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Education</h2>
          </div>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div key={index} className="ml-11">
                <h3 className="text-lg font-medium text-gray-900">{edu.school}</h3>
                <p className="text-indigo-600">{edu.degree}</p>
                {edu.score && <p className="text-gray-600">Score: {edu.score}</p>}
                {edu.status && <p className="text-gray-600">{edu.status}</p>}
                {index < education.length - 1 && <hr className="my-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <CodeBracketIcon className="h-8 w-8 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Skills</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skillGroup) => (
              <div key={skillGroup.category}>
                <h3 className="text-lg font-medium text-gray-900 mb-3">{skillGroup.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Links Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <LinkIcon className="h-8 w-8 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Connect & Profile Links</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors duration-200"
              >
                <GlobeAltIcon className="h-5 w-5 text-indigo-600 mr-2" />
                <span className="text-gray-700 hover:text-indigo-600">{link.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 