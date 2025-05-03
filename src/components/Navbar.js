// components/Navbar.js
export default function Navbar() {
    return (
        <nav className="bg-white shadow-md px-4 py-2 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-blue-600">MenteeConnect</h1>
            <ul className="flex space-x-4 text-gray-700 font-medium">
                <li><a href="#" className="hover:text-blue-600">Dashboard</a></li>
                <li><a href="#" className="hover:text-blue-600">Mentors</a></li>
                <li><a href="#" className="hover:text-blue-600">Mentees</a></li>
                <li><a href="#" className="hover:text-blue-600">Logout</a></li>
            </ul>
        </nav>
    );
}
