import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const token = useSelector((state) => state.user.token);

  if (!token) {
    toast.error('You must be logged in to access this page');
    return <Navigate to="/login" />;
  }

  return <Component {...rest} />;
};

export default PrivateRoute;
