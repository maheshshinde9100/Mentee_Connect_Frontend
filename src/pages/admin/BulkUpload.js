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
        <h1 className="page-title mb-2">Bulk Upload</h1>
        <p className="page-subtitle">Upload Excel or CSV files to add multiple mentors or mentees at once</p>
      </div>

      {/* Upload Type Selection */}
      <div className="card card-pad mb-6">
        <h2 className="section-title mb-4">Select Upload Type</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <button
            onClick={() => {
              setUploadType('mentors');
              setSelectedFile(null);
              setError('');
              setUploadResult(null);
              document.getElementById('file-upload').value = '';
            }}
            className={`rounded-xl border p-6 text-center transition-colors ${
              uploadType === 'mentors'
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
                : 'border-gray-200 hover:border-brand-300 dark:border-slate-700'
            }`}
          >
            <div className="mb-3 flex items-center justify-center">
              <GraduationCap className={`h-12 w-12 ${uploadType === 'mentors' ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400'}`} />
            </div>
            <h3 className="text-center text-lg font-semibold">Upload Mentors</h3>
            <p className="muted mt-2 text-center">
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
            className={`rounded-xl border p-6 text-center transition-colors ${
              uploadType === 'mentees'
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
                : 'border-gray-200 hover:border-brand-300 dark:border-slate-700'
            }`}
          >
            <div className="mb-3 flex items-center justify-center">
              <Users className={`h-12 w-12 ${uploadType === 'mentees' ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400'}`} />
            </div>
            <h3 className="text-center text-lg font-semibold">Upload Mentees</h3>
            <p className="muted mt-2 text-center">
              Add multiple students/mentees from Excel/CSV file
            </p>
          </button>
        </div>
      </div>

      {/* Download Template Section */}
      <div className="card card-pad mb-6">
        <h2 className="section-title mb-4">Download Template</h2>
        <p className="muted mb-4">
          Download the template file to see the required format for {uploadType}
        </p>
        <button
          onClick={() => downloadTemplate(uploadType)}
          className="btn-secondary"
        >
          <Download className="h-5 w-5" />
          Download {uploadType === 'mentors' ? 'Mentors' : 'Mentees'} Template
        </button>
        
        <div className="mt-6 rounded-xl border border-brand-200 bg-brand-50 p-4 dark:border-brand-900/50 dark:bg-brand-950/30">
          <div className="flex items-start">
            <AlertCircle className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-brand-600 dark:text-brand-400" />
            <div className="text-sm text-brand-800 dark:text-brand-200">
              <p className="mb-2 font-semibold">Required Fields for {uploadType === 'mentors' ? 'Mentors' : 'Mentees'}:</p>
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
      <div className="card card-pad mb-6">
        <h2 className="section-title mb-4">Upload File</h2>
        
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center transition-colors hover:border-brand-400 dark:border-slate-600">
          <FileSpreadsheet className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          
          <label htmlFor="file-upload" className="cursor-pointer">
            <span className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">
              Click to upload
            </span>
            <span className="muted"> or drag and drop</span>
            <input
              id="file-upload"
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          
          <p className="muted mt-2 text-sm">
            Excel (.xlsx, .xls) or CSV files only
          </p>
        </div>

        {selectedFile && (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700/70 dark:bg-slate-800/50">
            <div className="flex items-center">
              <FileSpreadsheet className="mr-2 h-5 w-5 text-brand-600 dark:text-brand-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{selectedFile.name}</span>
              <span className="muted ml-2 text-sm">
                ({(selectedFile.size / 1024).toFixed(2)} KB)
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedFile(null);
                document.getElementById('file-upload').value = '';
              }}
              className="text-red-600 hover:text-red-700 dark:text-red-400"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || loading}
          className="btn-primary btn-lg mt-6 w-full"
        >
          {loading ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-5 w-5" />
              Upload {uploadType === 'mentors' ? 'Mentors' : 'Mentees'}
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert-error mb-6">
          <div className="flex items-start">
            <XCircle className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium">Upload Failed</h3>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Result */}
      {uploadResult && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900/50 dark:bg-emerald-950/40">
          <div className="mb-4 flex items-start">
            <CheckCircle className="mr-2 mt-0.5 h-6 w-6 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">Upload Successful!</h3>
              <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
                {uploadResult.message || `${uploadType} have been successfully added to the database.`}
              </p>
            </div>
          </div>

          {uploadResult.summary && (
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="card p-4">
                <p className="muted text-sm">Total Records</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{uploadResult.summary.total || 0}</p>
              </div>
              <div className="card p-4">
                <p className="muted text-sm">Successfully Added</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{uploadResult.summary.success || 0}</p>
              </div>
              <div className="card p-4">
                <p className="muted text-sm">Failed</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{uploadResult.summary.failed || 0}</p>
              </div>
            </div>
          )}

          {uploadResult.errors && uploadResult.errors.length > 0 && (
            <div className="mt-4">
              <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Errors:</h4>
              <div className="max-h-48 overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 dark:border-slate-700/70 dark:bg-slate-800">
                <ul className="space-y-1 text-sm text-red-700 dark:text-red-400">
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
