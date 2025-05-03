import React from 'react';

const NotFound = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-red-600">404</h1>
                <p className="text-xl text-gray-600">Page Not Found</p>
            </div>
        </div>
    );
};

export default NotFound;
