import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { fetchPendingDoctors, approveDoctorRegistration, rejectDoctorRegistration } from '../../lib/api';

export default function DoctorApproval() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(null);

  // Check if user is an admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      showToast('Only administrators can access this page', 'error');
      window.location.href = '/pages/dashboard';
    }
  }, [user, showToast]);

  // Fetch pending doctor registrations
  useEffect(() => {
    const loadPendingDoctors = async () => {
      try {
        setLoading(true);
        const data = await fetchPendingDoctors();
        setPendingDoctors(data);
      } catch (error) {
        console.error('Failed to load pending doctor registrations:', error);
        showToast('Failed to load pending doctor registrations', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      loadPendingDoctors();
    }
  }, [user, showToast]);

  const handleApprove = async (doctorId) => {
    try {
      setActionInProgress(doctorId);
      await approveDoctorRegistration(doctorId);
      
      // Update the local state
      setPendingDoctors(pendingDoctors.filter(doctor => doctor.id !== doctorId));
      
      showToast('Doctor registration approved successfully', 'success');
    } catch (error) {
      console.error('Failed to approve doctor registration:', error);
      showToast('Failed to approve doctor registration', 'error');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (doctorId) => {
    // Confirm with the admin
    if (!confirm('Are you sure you want to reject this doctor registration?')) return;
    
    try {
      setActionInProgress(doctorId);
      await rejectDoctorRegistration(doctorId);
      
      // Update the local state
      setPendingDoctors(pendingDoctors.filter(doctor => doctor.id !== doctorId));
      
      showToast('Doctor registration rejected', 'success');
    } catch (error) {
      console.error('Failed to reject doctor registration:', error);
      showToast('Failed to reject doctor registration', 'error');
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Doctor Registration Approval</h1>
      
      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : pendingDoctors.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">No pending doctor registrations to review.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credentials
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingDoctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center">
                          👨‍⚕️
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            Dr. {doctor.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {doctor.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{doctor.email}</div>
                      <div className="text-sm text-gray-500">{doctor.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{doctor.specialization}</div>
                      <div className="text-sm text-gray-500">{doctor.experience} years experience</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{doctor.licenseNumber}</div>
                      {doctor.documents && (
                        <a 
                          href={doctor.documents} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:text-blue-700"
                        >
                          View Documents
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(doctor.registrationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleApprove(doctor.id)}
                        disabled={actionInProgress === doctor.id}
                        className="text-green-600 hover:text-green-900 mr-4 disabled:opacity-50"
                      >
                        {actionInProgress === doctor.id ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(doctor.id)}
                        disabled={actionInProgress === doctor.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {actionInProgress === doctor.id ? 'Processing...' : 'Reject'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}