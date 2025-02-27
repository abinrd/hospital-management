import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { fetchAppointments, cancelAppointment } from '../../lib/api';

export default function Appointments() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming'); // upcoming, past, all
  const [cancellingId, setCancellingId] = useState(null);

  // Fetch appointments
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        const data = await fetchAppointments(filter);
        setAppointments(data);
      } catch (error) {
        console.error('Failed to load appointments:', error);
        showToast('Failed to load appointments', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [filter, showToast]);

  const handleCancelAppointment = async (appointmentId) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
      setCancellingId(appointmentId);
      await cancelAppointment(appointmentId);
      
      // Update the local state to reflect the cancellation
      setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
      
      showToast('Appointment cancelled successfully', 'success');
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      showToast('Failed to cancel appointment', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      'no-show': 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatAppointmentDate = (dateString, timeString) => {
    const date = new Date(`${dateString}T${timeString}`);
    
    const dateFormatted = date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    const timeFormatted = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `${dateFormatted} at ${timeFormatted}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Appointments</h1>
        
        {user?.role !== 'doctor' && (
          <Link href="/pages/dashboard/book-appointment">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              Book New Appointment
            </button>
          </Link>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex space-x-4">
            <button
              className={`px-3 py-2 rounded-md text-sm font-medium ${filter === 'upcoming' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`px-3 py-2 rounded-md text-sm font-medium ${filter === 'past' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setFilter('past')}
            >
              Past
            </button>
            <button
              className={`px-3 py-2 rounded-md text-sm font-medium ${filter === 'all' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No appointments found.</p>
            {user?.role !== 'doctor' && filter === 'upcoming' && (
              <div className="mt-4">
                <Link href="/pages/dashboard/book-appointment">
                  <button className="text-blue-500 hover:text-blue-700 underline">
                    Book your first appointment
                  </button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {user?.role === 'doctor' ? 'Patient' : 'Doctor'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center">
                          {user?.role === 'doctor' ? '👤' : '👨‍⚕️'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user?.role === 'doctor' 
                              ? appointment.patientName 
                              : `Dr. ${appointment.doctorName}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user?.role === 'doctor' 
                              ? '' 
                              : appointment.doctorSpecialization}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatAppointmentDate(appointment.date, appointment.startTime)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Duration: {appointment.durationMinutes} min
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2">
                        {appointment.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(appointment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {appointment.status === 'scheduled' && (
                        <button
                          onClick={() => handleCancelAppointment(appointment.id)}
                          disabled={cancellingId === appointment.id}
                          className="text-red-600 hover:text-red-900 mr-4 disabled:opacity-50"
                        >
                          {cancellingId === appointment.id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}
                      <Link href={`/pages/dashboard/appointment/${appointment.id}`}>
                        <span className="text-blue-600 hover:text-blue-900">View Details</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}