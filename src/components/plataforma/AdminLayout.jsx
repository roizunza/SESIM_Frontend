import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header isAdmin={true} />
      <main style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;