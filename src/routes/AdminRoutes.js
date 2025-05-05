import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import AdminRoutes from './AdminRoutes';
import MentorRoutes from './MentorRoutes';
import StudentRoutes from './StudentRoutes';

const AppRoutes = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }

    // Safely get the role or default to empty string
    const userRole = user?.role || '';
    const lowerCaseRole = typeof userRole === 'string' ? userRole.toLowerCase() : '';

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to={`/${lowerCaseRole}`} replace />}
            />

            {userRole === 'ADMIN' && <Route path="/admin/*" element={<AdminRoutes />} />}
            {userRole === 'MENTOR' && <Route path="/mentor/*" element={<MentorRoutes />} />}
            {userRole === 'STUDENT' && <Route path="/student/*" element={<StudentRoutes />} />}

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;