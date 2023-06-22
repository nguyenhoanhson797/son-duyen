import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminAppLayout from './pages/AdminApp/AdminAppLayout';
import { APP_URL } from '../constants/app-config';
import InviteCard from './pages/InvitationApp/InviteCard';

const AppRouters = () => {
    return (
        <Routes>
            <Route
                path={`/admin`}
                element={<AdminAppLayout />}
            />

            <Route
                path={`${APP_URL}/admin`}
                element={<AdminAppLayout />}
            />

            <Route
                path={`/thiep-moi/:khachMoiId`}
                element={<InviteCard />}
            />

            <Route
                path={`${APP_URL}/thiep-moi/:khachMoiId`}
                element={<InviteCard />}
            />
        </Routes>
    );
};

export default AppRouters;