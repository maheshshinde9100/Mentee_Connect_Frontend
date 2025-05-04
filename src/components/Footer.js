import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-center py-4 text-sm text-gray-600 mt-4">
      © {new Date().getFullYear()} Student Mentoring System. All rights reserved.
    </footer>
  );
};

export default Footer;
