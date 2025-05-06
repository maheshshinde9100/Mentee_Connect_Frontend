import { Routes, Route } from 'react-router-dom';
import MentorLayout from '../layouts/MentorLayout';
import MentorDashboard from '../pages/mentor/Dashboard';
import Mentees from '../pages/mentor/Mentees';

const MentorRoutes = () => {
    return (
        <MentorLayout>
            <Routes>
                <Route index element={<MentorDashboard />} />
                <Route path="mentees" element={<Mentees />} /> {/* This matches '/mentor/mentees' */}
            </Routes>
        </MentorLayout>
    );
};

export default MentorRoutes;