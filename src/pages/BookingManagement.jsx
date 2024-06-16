import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://movie-booking-system-backend.onrender.com/api/bookings');
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to fetch bookings.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.delete(`https://movie-booking-system-backend.onrender.com/api/bookings/${bookingId}`);
      toast.success('Booking cancelled successfully!');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel booking.');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Optional: Replace with a loading spinner
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Booking Management</h1>
      <ul>
        {bookings.map((booking) => (
          <li key={booking._id}>
            {booking.movie} - {booking.showtime} - Seats: {booking.seats.join(', ')}
            <button
              onClick={() => handleCancelBooking(booking._id)}
              className="btn btn-danger ml-2"
            >
              Cancel
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingManagement;
