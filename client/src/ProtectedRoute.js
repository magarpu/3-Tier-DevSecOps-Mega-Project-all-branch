// src/ProtectedRoute.js
import React, { useContext } from 'react';
import { Redirect } from 'wouter';
import { AuthContext } from './context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Redirect to="/login" />;

  if (role && user.role !== role) {
    return <Redirect to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;

