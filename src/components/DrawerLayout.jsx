import React, { useState, useEffect } from 'react';
import { Link, Outlet, Navigate } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import 'daisyui/dist/full.css';

const DrawerLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen">
      {/* Drawer for small screens */}
      {/* <div className={`drawer drawer-mobile lg:hidden ${drawerOpen ? 'drawer-open' : ''}`}>
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-2xl font-bold">Movie Booking System</h1>
            <button className="btn btn-primary lg:hidden" onClick={toggleDrawer}>
              <FiMenu />
            </button>
          </div>
          <Outlet />
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 bg-base-100 text-base-content">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/booking">Booking</Link></li>
            {user.role === 'admin' && (
              <>
                <li><Link to="/admin/screen-management">Screen Management</Link></li>
                <li><Link to="/admin/booking-management">Booking Management</Link></li>
              </>
            )}
          </ul>
        </div>
      </div> */}

      {/* Drawer for large screens */}
      <div className="hidden lg:flex flex-col w-80 bg-base-200 text-base-content">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Movie Booking System</h1>
          <ul className="menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/booking">Booking</Link></li>
            {user.role === 'admin' && (
              <>
                <li><Link to="/admin/screen-management">Screen Management</Link></li>
                <li><Link to="/admin/booking-management">Booking Management</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default DrawerLayout;
