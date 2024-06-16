import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ element: Element, ...rest }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return <Element {...rest} />;
};

export default AdminRoute;
