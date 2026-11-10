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
    return (
      <div className="flex justify-center py-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400" />
      </div>
    );
  }

  return (
    <div className="card card-pad">
      <h2 className="section-title mb-4">Certificate Management</h2>
      
      {/* Upload Form */}
      <form onSubmit={handleUpload} className="mb-6 rounded-xl border border-gray-200 p-4 dark:border-slate-700/70">
        <div className="mb-4">
          <label className="label">
            Upload Certificate
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 dark:text-slate-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-brand-50 file:text-brand-700 dark:file:bg-brand-500/10 dark:file:text-brand-300
              hover:file:bg-brand-100 dark:hover:file:bg-brand-500/20"
          />
        </div>
        <div className="mb-4">
          <label className="label">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input"
            placeholder="Enter certificate description"
          />
        </div>
        <button
          type="submit"
          disabled={!selectedFile || uploading}
          className="btn btn-primary"
        >
          {uploading ? 'Uploading...' : 'Upload Certificate'}
        </button>
      </form>

      {error && (
        <div className="alert-error mb-4">
          {error}
        </div>
      )}

      {/* Certificates List */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {certificates.map((cert) => (
          <div key={cert.id} className="card card-pad card-hover flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <DocumentIcon className="h-8 w-8 text-gray-400 dark:text-slate-500" />
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">{cert.certificateName}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">{cert.description}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500">
                  Uploaded: {new Date(cert.uploadDate).toLocaleDateString()}
                </p>
                <span className={
                  cert.status === 'PENDING' ? 'badge-warn' :
                  cert.status === 'APPROVED' ? 'badge-success' :
                  'badge-danger'
                }>
                  {cert.status}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleDownload(cert.certificateUrl)}
                className="btn-icon"
                title="Download"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(cert.id)}
                className="btn-icon"
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