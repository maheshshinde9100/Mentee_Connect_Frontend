import React, { useState, useEffect } from 'react';
import { assignMentorToStudent, getStudents, getMentors } from '../../api/admin';

const AssignMentor = () => {
    const [students, setStudents] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedMentor, setSelectedMentor] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const studentsData = await getStudents();
                const mentorsData = await getMentors();
                setStudents(studentsData);
                setMentors(mentorsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await assignMentorToStudent(selectedStudent, selectedMentor);
            setMessage('Mentor assigned successfully!');
        } catch (error) {
            setMessage('Error assigning mentor');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Assign Mentor to Student</h1>
            <form onSubmit={handleSubmit} className="max-w-md space-y-4">
                <div>
                    <label className="block mb-2">Select Student</label>
                    <select
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">Select a student</option>
                        {students.map((student) => (
                            <option key={student._id} value={student.email}>
                                {student.name} ({student.email})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-2">Select Mentor</label>
                    <select
                        value={selectedMentor}
                        onChange={(e) => setSelectedMentor(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">Select a mentor</option>
                        {mentors.map((mentor) => (
                            <option key={mentor._id} value={mentor.name}>
                                {mentor.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Assign Mentor
                </button>
                {message && <p className="mt-4 text-green-600">{message}</p>}
            </form>
        </div>
    );
};

export default AssignMentor;