import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Booking from './pages/Booking';
import PrivateRoute from './components/PrivateRoute';
import DrawerLayout from './components/DrawerLayout';
import AdminRoute from './components/AdminRoute';
import AdminScreenManagement from './pages/ScreenManagement';
import AdminBookingManagement from './pages/BookingManagement';

function App() {
  return (
    <div className="container mx-auto h-screen">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<DrawerLayout/>}>
            <Route index element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/booking" element={<PrivateRoute element={Booking} />}/>
            <Route path="/admin/screen-management" element={<AdminRoute element={AdminScreenManagement} />} />
            <Route path="/admin/booking-management" element={<AdminRoute element={AdminBookingManagement} />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
