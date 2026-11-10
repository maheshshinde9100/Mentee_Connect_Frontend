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
      items: ['HTML', 'CSS', 'JavaScript', 'Tailwind CSS', 'React.js', 'Next.js']
    },
    {
      category: 'Backend',
      items: ['Java', 'Spring Boot', 'Hibernate', 'Spring Security', 'Microservices', 'Spring Cloud', 'ExpressJs']
    },
    {
      category: 'Android Development',
      items: ['Java', 'XML', 'Retrofit']
    },
    {
      category: 'Others',
      items: ['C++', 'Git & GitHub', 'SQL', 'MongoDB', 'Firebase', 'AppWrite', 'Apache Kafka', 'Redis']
    },
  ];

  const links = [
    {
      name: 'Portfolio',
      url: 'https://maheshshinde-dev.vercel.app',
    },
    {
      name: 'Resume',
      url: 'https://maheshshinde9100.hackerresume.io/cdbe784f-7325-4ca3-a047-9a2c4ec314cc',
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/maheshshinde9100',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/maheshshinde9100',
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="mb-6">
            <img
              src={personalInfo.photo}
              alt={personalInfo.name}
              loading="lazy"
              decoding="async"
              className="w-32 h-32 rounded-full mx-auto object-cover ring-1 ring-gray-200 dark:ring-slate-700"
            />
          </div>
          <p className="eyebrow">About</p>
          <h1 className="page-title mt-2">{personalInfo.name}</h1>
          <p className="mt-1 text-base font-medium text-brand-600 dark:text-brand-400">{personalInfo.title}</p>
          <p className="page-subtitle max-w-2xl mx-auto">{personalInfo.bio}</p>
        </div>

        {/* Education Section */}
        <div className="card card-pad">
          <div className="flex items-center mb-6">
            <span className="mr-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
              <AcademicCapIcon className="h-6 w-6" />
            </span>
            <h2 className="section-title">Education</h2>
          </div>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div key={index}>
                <h3 className="text-base font-medium text-gray-900 dark:text-white">{edu.school}</h3>
                <p className="text-sm font-medium text-brand-600 dark:text-brand-400">{edu.degree}</p>
                {edu.score && <p className="muted text-sm">Score: {edu.score}</p>}
                {edu.status && <p className="muted text-sm">{edu.status}</p>}
                {index < education.length - 1 && <hr className="my-4 border-gray-200 dark:border-slate-700" />}
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div className="card card-pad">
          <div className="flex items-center mb-6">
            <span className="mr-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
              <CodeBracketIcon className="h-6 w-6" />
            </span>
            <h2 className="section-title">Skills</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skillGroup) => (
              <div key={skillGroup.category}>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{skillGroup.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill) => (
                    <span
                      key={skill}
                      className="badge-neutral"
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
        <div className="card card-pad">
          <div className="flex items-center mb-6">
            <span className="mr-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
              <LinkIcon className="h-6 w-6" />
            </span>
            <h2 className="section-title">Connect & Profile Links</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card card-hover flex items-center px-4 py-3 text-gray-700 dark:text-slate-300"
              >
                <GlobeAltIcon className="h-5 w-5 mr-2 text-brand-600 dark:text-brand-400" />
                <span className="font-medium">{link.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
