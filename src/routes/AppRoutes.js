import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import MentorList from '../pages/Mentor/MentorList';
import MentorForm from '../pages/Mentor/MentorForm';
import StudentList from '../pages/Student/StudentList';
import StudentForm from '../pages/Student/StudentForm';
import BatchList from '../pages/Batch/BatchList';
import BatchForm from '../pages/Batch/BatchForm';
import Login from '../pages/Auth/Login';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/mentors" element={<MentorList />} />
            <Route path="/mentor/new" element={<MentorForm />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/student/new" element={<StudentForm />} />
            <Route path="/batches" element={<BatchList />} />
            <Route path="/batch/new" element={<BatchForm />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
