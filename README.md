# 🚀 MenteeConnect — Frontend

<div align="center">
  <img src="https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/WebRTC-Video_Call-FF6B6B?style=for-the-badge&logo=webrtc&logoColor=white" />
  <img src="https://img.shields.io/badge/WebSocket-Real_Time-FFCA28?style=for-the-badge&logo=websocket&logoColor=black" />
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/Axios-HTTP-5A29E4?style=for-the-badge&logo=axios&logoColor=white" />
  <a href="https://menteeconnect.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/🚀 Live-menteeconnect.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white" />
  </a>
</div>

<div align="center">
  <h3>🎯 React Frontend for Role-Based Mentor-Student Management</h3>
  <p><em>A feature-rich academic mentorship platform with real-time video calling, goal tracking, and role-based dashboards for Admins, Mentors, and Students.</em></p>
  <br/>
  <strong>🌐 <a href="https://menteeconnect.vercel.app/">menteeconnect.vercel.app</a></strong>
</div>

---

## ✨ Key Features

- **Multi-Role Dashboards** — Distinct experiences for Admin, Mentor, and Student
- **Live Video Calls** — WebRTC-powered 1-on-1 video sessions between mentors and mentees
- **Incoming Call Notifications** — Real-time alerts for mentees when a mentor initiates a call
- **Meeting History** — Mentors can review their past call records; Admins can view all meetings across the platform
- **Goal & Progress Tracking** — Assign, monitor, and complete goals seamlessly
- **Batch & Attendance Management** — Structured batch assignment with attendance tracking
- **Secure JWT Authentication** — Token-based auth with role-gated route protection
- **Real-Time Notifications** — Instant updates via WebSocket
- **Responsive UI** — Clean, modern interface built with Tailwind CSS

---

## 👥 User Roles

### 🛡️ Admin
- Manage all users — Admins, Mentors, and Students
- Create batches and assign mentors to student groups
- Broadcast notifications to users
- **View all video call histories** across all mentors on the platform
- Access platform-wide reports and analytics

### 👨‍🏫 Mentor
- View and manage allocated mentees
- **Initiate video calls** with mentees directly from the dashboard
- **View personal meeting history** — all past 1-on-1 sessions
- Update mentee progress, profiles, and attendance
- Assign goals/tasks and share learning resources

### 🎓 Student
- View mentor details and personal profile
- **Receive incoming call notifications** and accept/decline video calls
- Track progress, goals, and earned certificates
- Receive real-time updates from mentors
- Edit and manage own profile

---

## 📹 Video Call Feature

The video call system enables seamless real-time communication between mentors and their allocated mentees using **WebRTC**.

**How it works:**
1. Mentor initiates a call from the mentee's profile or dashboard
2. The mentee receives a real-time **incoming call notification** via WebSocket
3. Mentee accepts — the **1-on-1 video session begins** instantly
4. Call records are saved automatically upon session end
5. **Mentors** can review their individual meeting history at any time
6. **Admins** have centralized access to all video call records across every mentor

---

## 🛠️ Tech Stack

| Category       | Technology                           |
|----------------|---------------------------------------|
| UI Framework   | React 18+                             |
| Styling        | Tailwind CSS 3+                       |
| HTTP Client    | Axios                                 |
| Routing        | React Router v6                       |
| Real-Time      | WebSocket (notifications + signaling) |
| Video Calls    | WebRTC                                |
| Auth           | JWT (role-based, protected routes)    |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Backend server running on `http://localhost:8080`

---

## 📂 Project Structure

```
frontend/
└── src/
    ├── components/        # Reusable UI components (VideoCall, Navbar, Cards, etc.)
    ├── pages/             # Role-specific pages (AdminDashboard, MentorDashboard, etc.)
    ├── context/           # Global state (AuthContext, SocketContext)
    ├── hooks/             # Custom hooks (useWebRTC, useSocket, useAuth)
    ├── services/          # Axios API service modules
    └── utils/             # Helper functions and constants
```

---

## 🔧 Future Enhancements

- [ ] OAuth2 Login (Google, GitHub)
- [ ] Calendar sync for scheduling video meets
- [ ] Screen sharing during video calls
- [ ] Push & email notification support
- [ ] Dark mode UI
- [ ] Progressive Web App (PWA) support

---

## 👨‍💻 Developer

**Mahesh Shinde**

| Platform    | Link |
|-------------|------|
| 📧 Email    | [maheshshinde9100@gmail.com](mailto:maheshshinde9100@gmail.com) |
| 🌐 Portfolio | [maheshshinde-dev.vercel.app](https://maheshshinde-dev.vercel.app) |
| 🔗 LinkedIn  | [linkedin.com/in/maheshshinde9100](https://www.linkedin.com/in/maheshshinde9100) |
| 🐙 GitHub   | [github.com/maheshshinde9100](https://github.com/maheshshinde9100) |
| 💻 LeetCode  | [leetcode.com/u/code-with-mahesh](https://leetcode.com/u/code-with-mahesh/) |

> 💡 MenteeConnect is a personal academic project built with real-world scalability in mind. All rights reserved to the author.
