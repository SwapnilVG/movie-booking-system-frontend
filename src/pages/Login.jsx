import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate , Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { userActions } from '../store';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://movie-booking-system-backend.onrender.com/api/users/login', formData);
      const { token, user } = response.data;

      dispatch(userActions.login({ token, user }));
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
      <p className=' my-3'>
        Don't have an account? <Link className=' text-blue-600' to="/register">Signup</Link>
      </p>
    </form>
  );
};

export default Login;
