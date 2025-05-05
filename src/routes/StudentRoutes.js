import { Routes, Route } from 'react-router-dom';
import StudentLayout from '../layouts/StudentLayout';
import StudentDashboard from '../pages/student/Dashboard';
import Mentor from '../pages/student/Mentor';

const StudentRoutes = () => {
    return (
        <StudentLayout>
            <Routes>
                <Route index element={<StudentDashboard />} />
                <Route path="mentor" element={<Mentor />} />
            </Routes>
        </StudentLayout>
    );
};

export default StudentRoutes;