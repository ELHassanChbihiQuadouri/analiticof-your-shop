import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ShopSetup from './pages/ShopSetup';
import ManualEntry from './pages/ManualEntry';
import UserManagement from './pages/UserManagement';
import AddUserRole from './pages/AddUserRole';
import SignUpInvitation from './pages/SignUpInvitation';  // صفحة التسجيل بالرمز

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/shop-setup" element={<ShopSetup />} />
        <Route path="/manual-entry" element={<ManualEntry />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/manage-users/add" element={<AddUserRole />} />
        <Route path="/signup-invitation" element={<SignUpInvitation />} /> {/* التسجيل بالرمز */}
      </Routes>
    </Router>
  );
}

export default App;
