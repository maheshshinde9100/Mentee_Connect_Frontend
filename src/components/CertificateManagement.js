import React, { useState, useEffect } from 'react';
import { studentService } from '../services/studentService';
import { DocumentIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const CertificateManagement = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await studentService.getMyCertificates();
      setCertificates(response.data);
    } catch (err) {
      setError('Failed to fetch certificates');
      console.error('Error fetching certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('description', description);

      await studentService.uploadCertificate(formData);
      await fetchCertificates();
      
      // Reset form
      setSelectedFile(null);
      setDescription('');
      setError(null);
    } catch (err) {
      setError('Failed to upload certificate');
      console.error('Error uploading certificate:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (certificateId) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;

    try {
      await studentService.deleteCertificate(certificateId);
      await fetchCertificates();
    } catch (err) {
      setError('Failed to delete certificate');
      console.error('Error deleting certificate:', err);
    }
  };

  const handleDownload = async (certificateUrl) => {
    try {
      const response = await studentService.getCertificateFile(certificateUrl);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = certificateUrl.split('/').pop();
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download certificate');
      console.error('Error downloading certificate:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading certificates...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Certificate Management</h2>
      
      {/* Upload Form */}
      <form onSubmit={handleUpload} className="mb-6 p-4 border rounded-lg">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Certificate
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Enter certificate description"
          />
        </div>
        <button
          type="submit"
          disabled={!selectedFile || uploading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload Certificate'}
        </button>
      </form>

      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {/* Certificates List */}
      <div className="space-y-4">
        {certificates.map((cert) => (
          <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              <DocumentIcon className="h-8 w-8 text-gray-400" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">{cert.certificateName}</h3>
                <p className="text-sm text-gray-500">{cert.description}</p>
                <p className="text-xs text-gray-400">
                  Uploaded: {new Date(cert.uploadDate).toLocaleDateString()}
                </p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  cert.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  cert.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {cert.status}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleDownload(cert.certificateUrl)}
                className="p-2 text-gray-600 hover:text-blue-600"
                title="Download"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(cert.id)}
                className="p-2 text-gray-600 hover:text-red-600"
                title="Delete"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificateManagement; 