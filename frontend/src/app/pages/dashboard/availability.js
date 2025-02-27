import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { fetchAvailability, saveAvailability, deleteAvailabilitySlot } from '../../lib/api';

export default function DoctorAvailability() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [slotDuration, setSlotDuration] = useState(30); // In minutes
  const [isAdding, setIsAdding] = useState(false);

  // Check if user is a doctor
  useEffect(() => {
    if (user && user.role !== 'doctor') {
      showToast('Only doctors can access this page', 'error');
      window.location.href = '/pages/dashboard';
    }
  }, [user, showToast]);

  // Load doctor's availability
  useEffect(() => {
    const loadAvailability = async () => {
      try {
        setLoading(true);
        const data = await fetchAvailability();
        setAvailability(data);
      } catch (error) {
        console.error('Failed to load availability:', error);
        showToast('Failed to load availability data', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'doctor') {
      loadAvailability();
    }
  }, [user, showToast]);

  const handleAddAvailability = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!selectedDate) {
      showToast('Please select a date', 'error');
      return;
    }
    
    if (startTime >= endTime) {
      showToast('Start time must be before end time', 'error');
      return;
    }
    
    try {
      setSaving(true);
      
      await saveAvailability({
        date: selectedDate,
        startTime,
        endTime,
        slotDuration
      });
      
      // Reload availability
      const updatedAvailability = await fetchAvailability();
      setAvailability(updatedAvailability);
      
      // Reset form
      setSelectedDate('');
      setStartTime('09:00');
      setEndTime('17:00');
      setIsAdding(false);
      
      showToast('Availability saved successfully', 'success');
    } catch (error) {
      console.error('Failed to save availability:', error);
      showToast('Failed to save availability', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!confirm('Are you sure you want to delete this availability slot?')) return;
    
    try {
      await deleteAvailabilitySlot(slotId);
      
      // Update local state
      setAvailability(availability.filter(slot => slot.id !== slotId));
      
      showToast('Availability slot deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete availability slot:', error);
      showToast('Failed to delete availability slot', 'error');
    }
  };

  // Group availability by date
  const groupedAvailability = availability.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {});

  // Get dates in sorted order
  const sortedDates = Object.keys(groupedAvailability).sort((a, b) => new Date(a) - new Date(b));

  // Calculate min date (today) for date picker
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Availability</h1>
      
      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-6">
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isAdding ? 'Cancel' : 'Add Availability'}
            </button>
          </div>

          {isAdding && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Add New Availability</h2>
              <form onSubmit={handleAddAvailability}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="date" className="block text-gray-700 font-medium mb-2">Date</label>
                    <input
                      type="date"
                      id="date"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min={minDate}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="slotDuration" className="block text-gray-700 font-medium mb-2">Slot Duration (minutes)</label>
                    <select
                      id="slotDuration"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={slotDuration}
                      onChange={(e) => setSlotDuration(Number(e.target.value))}
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="startTime" className="block text-gray-700 font-medium mb-2">Start Time</label>
                    <input
                      type="time"
                      id="startTime"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="endTime" className="block text-gray-700 font-medium mb-2">End Time</label>
                    <input
                      type="time"
                      id="endTime"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md mr-2 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    onClick={() => setIsAdding(false)}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Availability'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {sortedDates.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-500">No availability slots configured yet.</p>
              {!isAdding && (
                <button 
                  onClick={() => setIsAdding(true)}
                  className="mt-4 text-blue-500 hover:text-blue-700 underline"
                >
                  Add your first availability slot
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {sortedDates.map(date => (
                <div key={date} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-blue-50 p-4 border-b">
                    <h3 className="text-lg font-medium text-gray-900">
                      {new Date(date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {groupedAvailability[date].map(slot => (
                        <div key={slot.id} className="bg-gray-50 p-4 rounded-md relative">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">
                                {new Date(`${date}T${slot.startTime}`).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })} - {' '}
                                {new Date(`${date}T${slot.endTime}`).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                {slot.slotDuration} min slots
                              </p>
                              {slot.booked > 0 && (
                                <p className="text-sm text-orange-500 mt-2">
                                  {slot.booked} appointment(s) booked
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => handleDeleteSlot(slot.id)}
                              className="text-red-500 hover:text-red-700"
                              disabled={slot.booked > 0}
                              title={slot.booked > 0 ? "Cannot delete slot with booked appointments" : "Delete slot"}
                            >
                              {slot.booked > 0 ? "🔒" : "×"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}