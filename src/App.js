import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

// Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import AssignMentor from './pages/Admin/AssignMentor';
import MentorList from './pages/Mentor/MentorList';
import MentorForm from './pages/Mentor/MentorForm';
import StudentList from './pages/Student/StudentList';
import StudentForm from './pages/Student/StudentForm';
import BatchList from './pages/Batch/BatchList';
import BatchForm from './pages/Batch/BatchForm';
import Login from './pages/Auth/Login';
import NotFound from './pages/NotFound';

const App = () => {
    return (
        <Router>
            <div className="flex">
                <Sidebar />
                <div className="flex-1">
                    <Header />
                    <main className="p-6">
                        <Routes>
                            {/* Auth Routes */}
                            <Route path="/login" exact component={Login} />

                            {/* Admin Routes */}
                            <Route path="/admin/dashboard" exact component={AdminDashboard} />
                            <Route path="/admin/assign-mentor" exact component={AssignMentor} />

                            {/* Mentor Routes */}
                            <Route path="/mentors" exact component={MentorList} />
                            <Route path="/mentors/add" exact component={MentorForm} />

                            {/* Student Routes */}
                            <Route path="/students" exact component={StudentList} />
                            <Route path="/students/add" exact component={StudentForm} />

                            {/* Batch Routes */}
                            <Route path="/batches" exact component={BatchList} />
                            <Route path="/batches/add" exact component={BatchForm} />

                            {/* 404 Not Found */}
                            <Route component={NotFound} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </div>
        </Router>
    );
};

export default App;
