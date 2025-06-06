# 🚀 MenteeConnect

<div align="center">
  <img src="https://img.shields.io/badge/Spring_Boot-3.0+-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-6.0+-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/WebSocket-Real_Time-FFCA28?style=for-the-badge&logo=websocket&logoColor=black" />
</div>

<div align="center">
  <h3>🎯 Mentor-Student Management System</h3>
  <p><em>A full-stack academic mentorship platform enabling seamless communication, goal tracking, and role-based dashboards for admins, mentors, and students.</em></p>
</div>

---

## ✨ Key Highlights

- Multi-role system: Admin, Mentor, and Student
- Profile & batch management
- Mentee progress & attendance tracking
- Secure authentication using JWT
- React frontend with Tailwind CSS
- Real-time notifications via WebSocket
- Video meet feature planned using WebRTC
- Mentor can assign goals, share resources & track mentees

---

## 👥 User Roles

### 🛡️ Admin
- Manage admins, mentors, students
- Create batches and assign mentors
- Send notifications to users
- View reports and analytics

### 👨‍🏫 Mentor
- View assigned mentees
- Update mentee progress and profiles
- Assign goals/tasks and share resources
- View own profile and update info
- Track mentee attendance
- Host video meets with mentees

### 🎓 Student
- View personal and mentor details
- Track progress, goals, and certificates
- Receive updates from mentors
- Edit and manage own profile

---

## 🛠️ Tech Stack

### Frontend

- React 18+
- Tailwind CSS 3+
- Axios
- React Router v6
- WebRTC (Planned)

### Backend

- Java 17+
- Spring Boot 3+
- Spring Security + JWT
- WebSocket for real-time features
- Redis (Planned)
- Kafka (Planned)

### Database

- MongoDB 6+
- MongoDB Compass (GUI)

---

## 🚀 Getting Started

### Prerequisites

- Java 17+
- MongoDB 6.0+
- Maven 3.6+
- Node.js + npm

### Setup Instructions

```bash
# Clone the project
cd MenteeConnect

# Backend Setup
cd backend
mvn clean install
mvn spring-boot:run

# Frontend Setup
cd ../frontend
npm install
npm start
```

> Ensure MongoDB is running on port `27017`.

---

## 📂 Project Structure

```
MenteeConnect/
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── hooks/
│       ├── services/
│       └── utils/
└── backend/
    └── src/main/java/
        ├── controllers/
        ├── services/
        ├── models/
        ├── repositories/
        └── security/
```

---

## ⚙️ Configuration

### MongoDB (`application.yml`)

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/menteeconnect
      database: menteeconnect
```

> 🔒 Always store JWT secrets and database URIs in environment variables.

---

## 🧠 Workflow Summary

### Admin
- Dashboard → Manage Users → Create Batches → Assign Mentors → Generate Reports

### Mentor
- View Mentees → Update Progress → Add Notes/Resources → Mark Attendance → Host Video Calls

### Student
- View Mentor → Track Goals → View Updates → Edit Profile

---

## 🔧 Future Enhancements

- [ ] Email & Push Notifications
- [ ] OAuth2 Login (Google, GitHub)
- [ ] Video Call Integration
- [ ] Calendar Sync for meets
- [ ] Redis for caching, Kafka for messaging
- [ ] CI/CD Deployment pipeline

---

## 👨‍💻 Developer Info

- 👨‍💻 Developed By: Mahesh Shinde  
- 🌐 Portfolio: [shindemaheshportfolio.netlify.app](https://shindemaheshportfolio.netlify.app)  
- 📧 Email: contact.shindemahesh2112@gmail.com  
- 🔗 LinkedIn: [Mahesh Shinde](https://www.linkedin.com/in/mahesh-shinde-0a666b23b)

> 💡 This is a personal academic project built with real-world scalability in mind. All rights reserved to the author.