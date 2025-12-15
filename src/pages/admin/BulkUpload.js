import React, { useState } from 'react';
import { Upload, Download, Users, GraduationCap, FileSpreadsheet, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';

const BulkUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadType, setUploadType] = useState('mentors'); // 'mentors' or 'mentees'
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];
      
      if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/)) {
        setError('Please upload a valid Excel file (.xlsx, .xls) or CSV file');
        setSelectedFile(null);
        return;
      }
      
      setSelectedFile(file);
      setError('');
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      let response;
      if (uploadType === 'mentors') {
        response = await adminService.bulkUploadMentors(formData);
      } else {
        response = await adminService.bulkUploadMentees(formData);
      }

      setUploadResult(response.data);
      setSelectedFile(null);
      // Reset file input
      document.getElementById('file-upload').value = '';
    } catch (err) {
      setError(
        err.response?.data?.message || 
        `Failed to upload ${uploadType}. Please check the file format and try again.`
      );
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = (type) => {
    // Create sample data based on type
    let csvContent = '';
    
    if (type === 'mentors') {
      csvContent = `username,email,password,firstName,lastName,phoneNumber,mentorId,department,specialization,designation,yearsOfExperience,maxStudents
john.doe,john.doe@example.com,password123,John,Doe,1234567890,M001,Computer Science,AI/ML,Professor,10,5
jane.smith,jane.smith@example.com,password123,Jane,Smith,0987654321,M002,Electronics,IoT,Associate Professor,8,4`;
    } else {
      csvContent = `username,email,password,firstName,lastName,phoneNumber,studentId,department,semester,rollNumber,batch
alice.student,alice@example.com,password123,Alice,Johnson,1112223333,S001,Computer Science,6,CS2021001,2021
bob.student,bob@example.com,password123,Bob,Williams,4445556666,S002,Computer Science,6,CS2021002,2021`;
    }

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bulk Upload</h1>
        <p className="text-gray-600 dark:text-gray-400">Upload Excel or CSV files to add multiple mentors or mentees at once</p>
      </div>

      {/* Upload Type Selection */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Select Upload Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => {
              setUploadType('mentors');
              setSelectedFile(null);
              setError('');
              setUploadResult(null);
              document.getElementById('file-upload').value = '';
            }}
            className={`p-6 rounded-lg border-2 transition-all ${
              uploadType === 'mentors'
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-gray-200 dark:border-slate-700 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center justify-center mb-3">
              <GraduationCap className={`w-12 h-12 ${uploadType === 'mentors' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`} />
            </div>
            <h3 className="text-lg font-semibold text-center">Upload Mentors</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
              Add multiple mentors from Excel/CSV file
            </p>
          </button>

          <button
            onClick={() => {
              setUploadType('mentees');
              setSelectedFile(null);
              setError('');
              setUploadResult(null);
              document.getElementById('file-upload').value = '';
            }}
            className={`p-6 rounded-lg border-2 transition-all ${
              uploadType === 'mentees'
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-gray-200 dark:border-slate-700 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center justify-center mb-3">
              <Users className={`w-12 h-12 ${uploadType === 'mentees' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`} />
            </div>
            <h3 className="text-lg font-semibold text-center">Upload Mentees</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
              Add multiple students/mentees from Excel/CSV file
            </p>
          </button>
        </div>
      </div>

      {/* Download Template Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Download Template</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Download the template file to see the required format for {uploadType}
        </p>
        <button
          onClick={() => downloadTemplate(uploadType)}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <Download className="w-5 h-5 mr-2" />
          Download {uploadType === 'mentors' ? 'Mentors' : 'Mentees'} Template
        </button>
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-2">Required Fields for {uploadType === 'mentors' ? 'Mentors' : 'Mentees'}:</p>
              {uploadType === 'mentors' ? (
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>username, email, password</li>
                  <li>firstName, lastName, phoneNumber</li>
                  <li>mentorId, department, specialization</li>
                  <li>designation, yearsOfExperience, maxStudents</li>
                </ul>
              ) : (
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>username, email, password</li>
                  <li>firstName, lastName, phoneNumber</li>
                  <li>studentId, department, semester</li>
                  <li>rollNumber, batch</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Upload File</h2>
        
        <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
          <FileSpreadsheet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          
          <label htmlFor="file-upload" className="cursor-pointer">
            <span className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:text-indigo-300 font-medium">
              Click to upload
            </span>
            <span className="text-gray-600 dark:text-gray-400"> or drag and drop</span>
            <input
              id="file-upload"
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Excel (.xlsx, .xls) or CSV files only
          </p>
        </div>

        {selectedFile && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-md flex items-center justify-between">
            <div className="flex items-center">
              <FileSpreadsheet className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{selectedFile.name}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                ({(selectedFile.size / 1024).toFixed(2)} KB)
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedFile(null);
                document.getElementById('file-upload').value = '';
              }}
              className="text-red-600 dark:text-red-400 hover:text-red-700"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || loading}
          className={`mt-6 w-full inline-flex items-center justify-center px-6 py-3 rounded-md font-medium transition-colors ${
            !selectedFile || loading
              ? 'bg-gray-300 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Upload {uploadType === 'mentors' ? 'Mentors' : 'Mentees'}
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Upload Failed</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Result */}
      {uploadResult && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg p-6">
          <div className="flex items-start mb-4">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-green-800">Upload Successful!</h3>
              <p className="text-sm text-green-700 mt-1">
                {uploadResult.message || `${uploadType} have been successfully added to the database.`}
              </p>
            </div>
          </div>

          {uploadResult.summary && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-md p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Records</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{uploadResult.summary.total || 0}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-md p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Successfully Added</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{uploadResult.summary.success || 0}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-md p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Failed</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{uploadResult.summary.failed || 0}</p>
              </div>
            </div>
          )}

          {uploadResult.errors && uploadResult.errors.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Errors:</h4>
              <div className="bg-white dark:bg-slate-800 rounded-md p-4 max-h-48 overflow-y-auto">
                <ul className="text-sm text-red-700 space-y-1">
                  {uploadResult.errors.map((error, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkUpload;
