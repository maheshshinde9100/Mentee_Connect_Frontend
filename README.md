# 🚀 MenteeConnect

<div align="center">
  <img src="https://img.shields.io/badge/Spring_Boot-3.0+-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4.4+-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/WebRTC-Socket.io-FE6F61?style=for-the-badge&logo=webrtc&logoColor=white" />
</div>

<div align="center">
  <h3>🎯 Mentor-Student Management System</h3>
  <p><em>An intuitive full-stack platform to streamline academic mentorship with role-based access, progress tracking, and communication features.</em></p>
</div>

---

## ✨ Key Highlights

- Multi-role system: Admin, Mentor, and Student
- Batch and profile management
- Academic progress tracking with certificates
- JWT-based secure authentication
- Modern React frontend with Tailwind CSS
- Real-time video and chat using WebRTC + Socket.io

---

## 🎭 User Roles

### 🛡️ Admin
- Manage users and roles  
- Create batches and assign mentors  
- Access analytics and generate reports  

### 👨‍🏫 Mentor
- View and manage assigned students  
- Update student progress and qualifications  
- Manage personal profile  

### 🎓 Student
- View personal dashboard and mentor details  
- Track academic progress and earned certificates  
- Edit profile information  

---

## 🛠️ Tech Stack

### Frontend

| Technology | Badge |
|-----------|--------|
| React | ![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=white) |
| Tailwind CSS | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) |
| Axios | ![Axios](https://img.shields.io/badge/Axios-HTTP_Client-5A29E4?style=for-the-badge&logo=axios&logoColor=white) |
| React Router | ![React Router](https://img.shields.io/badge/React_Router-v6-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white) |
| WebRTC | ![WebRTC](https://img.shields.io/badge/WebRTC-Peer_to_Peer-FE6F61?style=for-the-badge&logo=webrtc&logoColor=white) |

### Backend

| Technology | Badge |
|-----------|--------|
| Java | ![Java](https://img.shields.io/badge/Java-17+-007396?style=for-the-badge&logo=java&logoColor=white) |
| Spring Boot | ![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.0+-6DB33F?style=for-the-badge&logo=springboot&logoColor=white) |
| JWT | ![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white) |
| WebSocket | ![WebSocket](https://img.shields.io/badge/WebSocket-Real_time-FFCA28?style=for-the-badge&logo=websocket&logoColor=black) |

### Database

| Technology | Badge |
|-----------|--------|
| MongoDB | ![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-47A248?style=for-the-badge&logo=mongodb&logoColor=white) |
| MongoDB Compass | ![MongoDB Compass](https://img.shields.io/badge/Compass-GUI-47A248?style=for-the-badge&logo=mongodb&logoColor=white) |

---

## 🚀 Getting Started

### Prerequisites
- Java 17+  
- MongoDB 4.4+  
- Maven 3.6+  
- Node.js + npm  

### Setup Instructions

```bash
# Clone the repo
git clone https://github.com/coder-mahi/Mentee_Connect.git
cd Mentee_Connect

# Backend
cd backend
mvn clean install
mvn spring-boot:run

# Frontend (in new terminal)
cd ../frontend
npm install
npm start
```

MongoDB should be running on default port.

### Access Points
- Backend: `http://localhost:8080`  
- Frontend: `http://localhost:3000`

### Demo Logins
```
Admin:   admin@menteeconnect.com / admin123
Mentor:  mentor@menteeconnect.com / mentor123
Student: student@menteeconnect.com / student123
```

---

## 🧩 Project Structure

```
MenteeConnect/
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── context/
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

## 🔧 Configuration

### MongoDB (`application.yml`)

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/menteeconnect
      database: menteeconnect
```

### JWT Configuration

Sensitive JWT secrets should be stored in environment variables or external vaults for security.

---

## 🧠 Workflows

### Admin
- Login → Dashboard → Manage Users → Create Batches → Assign Mentors → Generate Reports

### Mentor
- Login → View Students → Update Progress → Add Certificates

### Student
- Login → View Profile → See Mentor Info → Track Progress

---

## 🐳 Docker Deployment

```dockerfile
FROM openjdk:17-jdk-slim
COPY target/menteeconnect.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

---

## 🤝 Contributing

We welcome contributions:

1. Fork the repo  
2. Create a feature branch  
3. Commit and push your code  
4. Open a Pull Request  

---

## 🛣️ Future Enhancements

- [ ] Email notifications  
- [ ] Calendar integrations  
- [ ] Cloud deployment pipeline  
- [ ] Role-based access logging  

---