import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://movie-booking-system-backend.onrender.com/api/users/login', formData);
      const { token, user } = response.data;

      // Save token and user information in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ email: user.email, role: user.role }));

      toast.success('Login successful!');

      // Navigate to appropriate page based on user role
      if (user.role === 'admin') {
        navigate('/admin/screen-management');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <div className="form-control">
        <label className="label">Email</label>
        <input
          type="email"
          name="email"
          className="input input-bordered"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-control">
        <label className="label">Password</label>
        <input
          type="password"
          name="password"
          className="input input-bordered"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary mt-4">Login</button>
    </form>
  );
};

export default Login;
