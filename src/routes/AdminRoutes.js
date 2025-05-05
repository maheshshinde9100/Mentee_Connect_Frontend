import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../pages/admin/Dashboard';
import AssignMentor from '../pages/admin/AssignMentor';
import Mentors from '../pages/admin/Mentors';
import Students from '../pages/admin/Students';
import Batches from '../pages/admin/Batches';

const AdminRoutes = () => {
    return (
        <AdminLayout>
            <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="assign-mentor" element={<AssignMentor />} />
                <Route path="mentors" element={<Mentors />} />
                <Route path="students" element={<Students />} />
                <Route path="batches" element={<Batches />} />
            </Routes>
        </AdminLayout>
    );
};

export default AdminRoutes;