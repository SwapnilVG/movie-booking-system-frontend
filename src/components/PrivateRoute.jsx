import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = localStorage.getItem('token');

  if (!isAuthenticated) {
    toast.error('You must be logged in to access this page');
    return <Navigate to="/login" />;
  }

  return <Component {...rest} />;
};

export default PrivateRoute;
