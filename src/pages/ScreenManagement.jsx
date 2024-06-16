import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ScreenManagement = () => {
  const [screens, setScreens] = useState([]);
  const [newScreen, setNewScreen] = useState({ name: '', seatLimit: 0 });

  useEffect(() => {
    fetchScreens();
  }, []);

  const fetchScreens = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://movie-booking-system-backend.onrender.com/api/screens', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setScreens(response.data);
    } catch (error) {
      toast.error('Failed to fetch screens.');
      console.error('Error fetching screens:', error.response ? error.response.data.message : error.message);
    }
  };

  const handleChange = (e) => {
    setNewScreen({ ...newScreen, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://movie-booking-system-backend.onrender.com/api/screens', newScreen, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Screen added successfully!');
      fetchScreens();
      setNewScreen({ name: '', seatLimit: 0 }); // Clear the form
    } catch (error) {
      toast.error('Failed to add screen.');
      console.error('Error adding screen:', error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Screen Management</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-control">
          <label className="label">Name</label>
          <input
            type="text"
            name="name"
            className="input input-bordered"
            value={newScreen.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-control">
          <label className="label">Seat Limit</label>
          <input
            type="number"
            name="seatLimit"
            className="input input-bordered"
            value={newScreen.seatLimit}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-4">Add Screen</button>
      </form>
      <h2 className="text-xl mb-2">Existing Screens</h2>
      <ul>
        {screens.map((screen) => (
          <li key={screen._id}>{screen.name} - {screen.seatLimit} seats</li>
        ))}
      </ul>
    </div>
  );
};

export default ScreenManagement;
