import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ element: Element, ...rest }) => {
  const user = useSelector((state) => state.user.user);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return <Element {...rest} />;
};

export default AdminRoute;
