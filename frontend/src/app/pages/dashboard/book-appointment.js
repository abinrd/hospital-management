import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { fetchDoctors, fetchDoctorAvailability, bookAppointment } from '../../lib/api';

export default function BookAppointment() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all doctors
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true);
        const data = await fetchDoctors();
        setDoctors(data);
      } catch (error) {
        console.error('Failed to load doctors:', error);
        showToast('Failed to load doctors', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, [showToast]);

  // Fetch doctor availability when a doctor is selected
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedDoctor) return;
      
      try {
        setLoading(true);
        const availability = await fetchDoctorAvailability(selectedDoctor);
        
        // Extract unique dates from availability
        const dates = [...new Set(availability.map(slot => slot.date))];
        setAvailableDates(dates);
        setSelectedDate('');
        setAvailableSlots([]);
        setSelectedSlot('');
      } catch (error) {
        console.error('Failed to fetch doctor availability:', error);
        showToast('Failed to fetch doctor availability', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [selectedDoctor, showToast]);

  // Update available slots when date is selected
  useEffect(() => {
    if (!selectedDoctor || !selectedDate) return;
    
    const fetchSlots = async () => {
      try {
        setLoading(true);
        const availability = await fetchDoctorAvailability(selectedDoctor, selectedDate);
        setAvailableSlots(availability);
        setSelectedSlot('');
      } catch (error) {
        console.error('Failed to fetch time slots:', error);
        showToast('Failed to fetch time slots', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate, selectedDoctor, showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      setSubmitting(true);
      
      await bookAppointment({
        doctorId: selectedDoctor,
        date: selectedDate,
        slotId: selectedSlot,
        reason
      });
      
      showToast('Appointment booked successfully!', 'success');
      router.push('/pages/dashboard/appointment');
    } catch (error) {
      console.error('Failed to book appointment:', error);
      showToast('Failed to book appointment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book an Appointment</h1>
      
      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <label htmlFor="doctor" className="block text-gray-700 font-medium mb-2">Select Doctor</label>
          <select
            id="doctor"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            disabled={loading || submitting}
            required
          >
            <option value="">Select a doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                Dr. {doctor.name} - {doctor.specialization}
              </option>
            ))}
          </select>
        </div>

        {selectedDoctor && (
          <div className="mb-6">
            <label htmlFor="date" className="block text-gray-700 font-medium mb-2">Select Date</label>
            <select
              id="date"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              disabled={loading || submitting || availableDates.length === 0}
              required
            >
              <option value="">Select a date</option>
              {availableDates.map((date) => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </option>
              ))}
            </select>
            {availableDates.length === 0 && selectedDoctor && !loading && (
              <p className="text-red-500 text-sm mt-1">No available dates for this doctor</p>
            )}
          </div>
        )}

        {selectedDate && (
          <div className="mb-6">
            <label htmlFor="slot" className="block text-gray-700 font-medium mb-2">Select Time Slot</label>
            <select
              id="slot"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              disabled={loading || submitting || availableSlots.length === 0}
              required
            >
              <option value="">Select a time slot</option>
              {availableSlots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {new Date(`${selectedDate}T${slot.startTime}`).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })} - {new Date(`${selectedDate}T${slot.endTime}`).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </option>
              ))}
            </select>
            {availableSlots.length === 0 && selectedDate && !loading && (
              <p className="text-red-500 text-sm mt-1">No available time slots for this date</p>
            )}
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="reason" className="block text-gray-700 font-medium mb-2">Reason for Visit</label>
          <textarea
            id="reason"
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Please describe your symptoms or reason for the appointment"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={submitting}
            required
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md mr-2 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={() => router.back()}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading || submitting || !selectedDoctor || !selectedDate || !selectedSlot}
          >
            {submitting ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
}



