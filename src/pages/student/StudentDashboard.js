// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import {
//   AcademicCapIcon,
//   UserGroupIcon,
//   ClockIcon,
//   CheckCircleIcon,
//   ChartBarIcon,
//   CalendarIcon,
//   ClipboardDocumentListIcon,
//   BookOpenIcon,
//   VideoCameraIcon,
// } from '@heroicons/react/24/outline';
// import meetingService from '../../services/meetingService';
// import VideoCall from '../../components/VideoCall';

// const StudentDashboard = () => {
//   const { user, isAuthenticated } = useAuth();
//   const [activeMeetings, setActiveMeetings] = useState([]);
//   const [currentMeeting, setCurrentMeeting] = useState(null);
//   const [loading, setLoading] = useState(false);
  
//   console.log('Auth State:', { user, isAuthenticated }); // Debugging line

//   useEffect(() => {
//     // Fetch active meetings when the component mounts
//     if (user && user.id) {
//       fetchActiveMeetings();
//     }
    
//     // Poll for new meetings every 60 seconds
//     const intervalId = setInterval(() => {
//       if (user && user.id) {
//         fetchActiveMeetings();
//       }
//     }, 60000);
    
//     return () => clearInterval(intervalId);
//   }, [user]);

//   const fetchActiveMeetings = async () => {
//     try {
//       setLoading(true);
//       // In a real app, you'd use the actual student ID
//       const studentId = user?.id || 'currentStudent';
//       const response = await meetingService.getStudentMeetings(studentId);
      
//       // Only show active or upcoming meetings
//       const active = response.data.filter(
//         meeting => meeting.status === 'active' || meeting.status === 'scheduled'
//       );
      
//       setActiveMeetings(active);
//     } catch (error) {
//       console.error('Error fetching active meetings:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleJoinMeeting = (meeting) => {
//     setCurrentMeeting(meeting);
//   };

//   const handleLeaveMeeting = () => {
//     setCurrentMeeting(null);
//   };

//   // Example data - In a real app, this would come from your backend
//   const studentInfo = {
//     name: user?.firstName + ' ' + user?.lastName || 'Loading...',
//     department: user?.department || 'Computer Science',
//     year: user?.year || '3rd Year',
//     mentor: user?.mentor?.name || 'Assigned Mentor',
//     completedTasks: 15,
//     totalTasks: 20,
//     attendance: 85,
//     upcomingMeetings: [
//       {
//         id: 1,
//         title: 'Weekly Mentoring Session',
//         date: '2024-03-25',
//         time: '10:00 AM',
//         mentor: 'Dr. Sarah Wilson',
//       },
//       {
//         id: 2,
//         title: 'Project Review',
//         date: '2024-03-27',
//         time: '2:00 PM',
//         mentor: 'Dr. Sarah Wilson',
//       },
//     ],
//     recentTasks: [
//       {
//         id: 1,
//         title: 'Complete Java Assignment',
//         deadline: '2024-03-24',
//         status: 'pending',
//         priority: 'high',
//       },
//       {
//         id: 2,
//         title: 'Submit Project Documentation',
//         deadline: '2024-03-26',
//         status: 'completed',
//         priority: 'medium',
//       },
//       {
//         id: 3,
//         title: 'Prepare for Technical Presentation',
//         deadline: '2024-03-28',
//         status: 'pending',
//         priority: 'high',
//       },
//     ],
//     skills: [
//       { name: 'Java', progress: 75 },
//       { name: 'Python', progress: 60 },
//       { name: 'Web Development', progress: 85 },
//       { name: 'Database Management', progress: 70 },
//     ],
//   };

//   const statsCards = [
//     {
//       title: 'Task Completion',
//       value: `${studentInfo.completedTasks}/${studentInfo.totalTasks}`,
//       description: 'Tasks completed this month',
//       icon: ClipboardDocumentListIcon,
//       color: 'bg-blue-500',
//     },
//     {
//       title: 'Attendance',
//       value: `${studentInfo.attendance}%`,
//       description: 'Overall attendance',
//       icon: ChartBarIcon,
//       color: 'bg-green-500',
//     },
//     {
//       title: 'Upcoming Sessions',
//       value: studentInfo.upcomingMeetings.length,
//       description: 'Scheduled mentoring sessions',
//       icon: CalendarIcon,
//       color: 'bg-purple-500',
//     },
//     {
//       title: 'Skills Tracked',
//       value: studentInfo.skills.length,
//       description: 'Skills being monitored',
//       icon: BookOpenIcon,
//       color: 'bg-yellow-500',
//     },
//   ];

//   // If student is in a meeting, show the video call interface
//   if (currentMeeting) {
//     return (
//       <div className="py-6 px-4 sm:px-6 md:px-8">
//         <div className="mb-6 flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-gray-900">
//             Meeting: {currentMeeting.title}
//           </h1>
//           <button
//             onClick={handleLeaveMeeting}
//             className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 transition"
//           >
//             Back to Dashboard
//           </button>
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="mb-4">
//             <p className="text-sm text-gray-600">
//               Mentor: <span className="font-medium">{currentMeeting.mentorName}</span>
//             </p>
//             <p className="text-sm text-gray-600 mt-1">{currentMeeting.description}</p>
//           </div>
          
//           <VideoCall
//             meetingId={currentMeeting.id}
//             meetingLink={currentMeeting.meetingLink}
//             isHost={false}
//           />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="py-6">
//       {/* Student Info Header */}
//       <div className="px-4 sm:px-6 md:px-8 mb-6">
//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">{studentInfo.name}</h1>
//               <div className="mt-1 flex items-center space-x-4 text-gray-600">
//                 <div className="flex items-center">
//                   <AcademicCapIcon className="h-5 w-5 mr-2" />
//                   <span>{studentInfo.department} - {studentInfo.year}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <UserGroupIcon className="h-5 w-5 mr-2" />
//                   <span>Mentor: {studentInfo.mentor}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Active Meetings Alert */}
//       {activeMeetings.length > 0 && (
//         <div className="px-4 sm:px-6 md:px-8 mb-6">
//           <div className="bg-indigo-50 border-l-4 border-indigo-500 rounded-lg shadow-md p-4">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <VideoCameraIcon className="h-6 w-6 text-indigo-600" />
//               </div>
//               <div className="ml-3">
//                 <h3 className="text-lg font-medium text-indigo-800">
//                   Active Meeting{activeMeetings.length > 1 ? 's' : ''} Available!
//                 </h3>
//                 <div className="mt-2 space-y-2">
//                   {activeMeetings.map(meeting => (
//                     <div key={meeting.id} className="flex justify-between items-center">
//                       <div>
//                         <p className="text-indigo-700 font-medium">{meeting.title}</p>
//                         <p className="text-sm text-indigo-600">Hosted by {meeting.mentorName}</p>
//                       </div>
//                       <button
//                         onClick={() => handleJoinMeeting(meeting)}
//                         className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white transition"
//                       >
//                         Join Meeting
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-6 md:px-8 mb-6">
//         {statsCards.map((stat, index) => (
//           <div key={index} className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center">
//               <div className={`p-3 rounded-lg ${stat.color}`}>
//                 <stat.icon className="h-6 w-6 text-white" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">{stat.title}</p>
//                 <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
//                 <p className="text-sm text-gray-500">{stat.description}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 sm:px-6 md:px-8">
//         {/* Upcoming Meetings */}
//         <div className="bg-white rounded-lg shadow">
//           <div className="p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h2>
//             <div className="space-y-4">
//               {studentInfo.upcomingMeetings.map((meeting) => (
//                 <div key={meeting.id} className="flex items-start p-4 bg-gray-50 rounded-lg">
//                   <ClockIcon className="h-6 w-6 text-indigo-600 mt-1" />
//                   <div className="ml-4">
//                     <p className="font-medium text-gray-900">{meeting.title}</p>
//                     <p className="text-sm text-gray-600">
//                       {meeting.date} at {meeting.time}
//                     </p>
//                     <p className="text-sm text-gray-500">with {meeting.mentor}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Tasks */}
//         <div className="bg-white rounded-lg shadow">
//           <div className="p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Tasks</h2>
//             <div className="space-y-4">
//               {studentInfo.recentTasks.map((task) => (
//                 <div key={task.id} className="flex items-start p-4 bg-gray-50 rounded-lg">
//                   <CheckCircleIcon 
//                     className={`h-6 w-6 ${
//                       task.status === 'completed' ? 'text-green-500' : 'text-gray-400'
//                     } mt-1`}
//                   />
//                   <div className="ml-4 flex-1">
//                     <div className="flex items-center justify-between">
//                       <p className="font-medium text-gray-900">{task.title}</p>
//                       <span className={`px-2 py-1 text-xs rounded-full ${
//                         task.priority === 'high' 
//                           ? 'bg-red-100 text-red-800' 
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {task.priority}
//                       </span>
//                     </div>
//                     <p className="text-sm text-gray-600">Due: {task.deadline}</p>
//                     <p className={`text-sm ${
//                       task.status === 'completed' ? 'text-green-600' : 'text-gray-500'
//                     }`}>
//                       Status: {task.status}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Skills Progress */}
//       <div className="px-4 sm:px-6 md:px-8 mt-6">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills Progress</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {studentInfo.skills.map((skill, index) => (
//               <div key={index} className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-medium text-gray-600">{skill.name}</span>
//                   <span className="text-sm font-medium text-gray-900">{skill.progress}%</span>
//                 </div>
//                 <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
//                   <div
//                     style={{ width: `${skill.progress}%` }}
//                     className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentDashboard;

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
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import meetingService from '../../services/meetingService';
import VideoCall from '../../components/VideoCall';

const StudentDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeMeetings, setActiveMeetings] = useState([]);
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [loading, setLoading] = useState(false);
  
  console.log('Auth State:', { user, isAuthenticated }); // Debugging line

  useEffect(() => {
    // Fetch active meetings when the component mounts
    if (user && user.id) {
      fetchActiveMeetings();
    }
    
    // Poll for new meetings every 60 seconds
    const intervalId = setInterval(() => {
      if (user && user.id) {
        fetchActiveMeetings();
      }
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [user]);

  const fetchActiveMeetings = async () => {
    try {
      setLoading(true);
      // In a real app, you'd use the actual student ID
      const studentId = user?.id || 'currentStudent';
      const response = await meetingService.getStudentMeetings(studentId);
      
      // Only show active or upcoming meetings
      const active = response.data.filter(
        meeting => meeting.status === 'active' || meeting.status === 'scheduled'
      );
      
      setActiveMeetings(active);
    } catch (error) {
      console.error('Error fetching active meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMeeting = (meeting) => {
    setCurrentMeeting(meeting);
  };

  const handleLeaveMeeting = () => {
    setCurrentMeeting(null);
  };

  // Sample data for Mahesh Shinde - Computer Engineering Student
  const studentInfo = {
    // name: user?.firstName + ' ' + user?.lastName || 'Mahesh Shinde',
    name: 'Mahesh Shinde',
    department: user?.department || 'Computer Engineering',
    year: user?.year || 'Second Year (2nd Year)',
    mentor: user?.mentor?.name || 'Steve Rogers',
    completedTasks: 18,
    totalTasks: 22,
    attendance: 92,
    upcomingMeetings: [
      {
        id: 1,
        title: 'Technical Interview',
        date: '2025-06-09',
        time: '11:00 AM',
        mentor: 'Steve Rogers',
      },
      {
        id: 2,
        title: 'Mock Interview',
        date: '2025-06-11',
        time: '3:30 PM',
        mentor: 'Steve Rogers',
      },
      {
        id: 3,
        title: 'Career Guidance Session',
        date: '2025-06-13',
        time: '10:00 AM',
        mentor: 'Steve Rogers',
      },
    ],
    recentTasks: [
      {
        id: 1,
        title: 'Complete Machine Learning Project Implementation',
        deadline: '2025-06-08',
        status: 'pending',
        priority: 'high',
      },
      {
        id: 2,
        title: 'Submit Database Design Documentation',
        deadline: '2025-06-06',
        status: 'completed',
        priority: 'medium',
      },
      {
        id: 3,
        title: 'Prepare System Architecture Presentation',
        deadline: '2025-06-12',
        status: 'pending',
        priority: 'high',
      },
      {
        id: 4,
        title: 'Code Review for Web Application',
        deadline: '2025-06-05',
        status: 'completed',
        priority: 'medium',
      },
      {
        id: 5,
        title: 'Update Resume and LinkedIn Profile',
        deadline: '2025-06-10',
        status: 'pending',
        priority: 'low',
      },
    ],
    skills: [
      { name: 'Java Programming', progress: 89 },
      { name: 'Python & Machine Learning', progress: 45 },
      { name: 'Web Development (MERN Stack)', progress: 84 },
      { name: 'Database Management (SQL/NoSQL)', progress: 86 },
      { name: 'Data Structures & Algorithms', progress: 90 },
      { name: 'System Design', progress: 76 },
    ],
  };

  const statsCards = [
    {
      title: 'Task Completion',
      value: `${studentInfo.completedTasks}/${studentInfo.totalTasks}`,
      description: 'Tasks completed this month',
      icon: ClipboardDocumentListIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Attendance',
      value: `${studentInfo.attendance}%`,
      description: 'Overall attendance',
      icon: ChartBarIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Upcoming Sessions',
      value: studentInfo.upcomingMeetings.length,
      description: 'Scheduled mentoring sessions',
      icon: CalendarIcon,
      color: 'bg-purple-500',
    },
    {
      title: 'Skills Tracked',
      value: studentInfo.skills.length,
      description: 'Skills being monitored',
      icon: BookOpenIcon,
      color: 'bg-yellow-500',
    },
  ];

  // If student is in a meeting, show the video call interface
  if (currentMeeting) {
    return (
      <div className="py-6 px-4 sm:px-6 md:px-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Meeting: {currentMeeting.title}
          </h1>
          <button
            onClick={handleLeaveMeeting}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 transition"
          >
            Back to Dashboard
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Mentor: <span className="font-medium">{currentMeeting.mentorName}</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">{currentMeeting.description}</p>
          </div>
          
          <VideoCall
            meetingId={currentMeeting.id}
            meetingLink={currentMeeting.meetingLink}
            isHost={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Student Info Header */}
      <div className="px-4 sm:px-6 md:px-8 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{studentInfo.name}</h1>
              <div className="mt-1 flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <AcademicCapIcon className="h-5 w-5 mr-2" />
                  <span>{studentInfo.department} - {studentInfo.year}</span>
                </div>
                <div className="flex items-center">
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  <span>Mentor: {studentInfo.mentor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Meetings Alert */}
      {activeMeetings.length > 0 && (
        <div className="px-4 sm:px-6 md:px-8 mb-6">
          <div className="bg-indigo-50 border-l-4 border-indigo-500 rounded-lg shadow-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <VideoCameraIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-indigo-800">
                  Active Meeting{activeMeetings.length > 1 ? 's' : ''} Available!
                </h3>
                <div className="mt-2 space-y-2">
                  {activeMeetings.map(meeting => (
                    <div key={meeting.id} className="flex justify-between items-center">
                      <div>
                        <p className="text-indigo-700 font-medium">{meeting.title}</p>
                        <p className="text-sm text-indigo-600">Hosted by {meeting.mentorName}</p>
                      </div>
                      <button
                        onClick={() => handleJoinMeeting(meeting)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white transition"
                      >
                        Join Meeting
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-6 md:px-8 mb-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 sm:px-6 md:px-8">
        {/* Upcoming Meetings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h2>
            <div className="space-y-4">
              {studentInfo.upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-indigo-600 mt-1" />
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">{meeting.title}</p>
                    <p className="text-sm text-gray-600">
                      {meeting.date} at {meeting.time}
                    </p>
                    <p className="text-sm text-gray-500">with {meeting.mentor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Tasks</h2>
            <div className="space-y-4">
              {studentInfo.recentTasks.map((task) => (
                <div key={task.id} className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <CheckCircleIcon 
                    className={`h-6 w-6 ${
                      task.status === 'completed' ? 'text-green-500' : 'text-gray-400'
                    } mt-1`}
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : task.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Due: {task.deadline}</p>
                    <p className={`text-sm ${
                      task.status === 'completed' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      Status: {task.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Skills Progress */}
      <div className="px-4 sm:px-6 md:px-8 mt-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {studentInfo.skills.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{skill.name}</span>
                  <span className="text-sm font-medium text-gray-900">{skill.progress}%</span>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${skill.progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;