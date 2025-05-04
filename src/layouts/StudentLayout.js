import React from 'react';
import Sidebar from '../components/Student/Sidebar';
import Header from '../components/Header';

const StudentLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default StudentLayout;
