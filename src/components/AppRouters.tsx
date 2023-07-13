import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminAppLayout from './pages/AdminApp/AdminAppLayout';
import { APP_URL } from '../constants/app-config';
import InviteCard from './pages/InvitationApp/InviteCard';
import LotoApp from './pages/LotoApp/LotoApp';

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

            <Route
                path={`/loto-app`}
                element={<LotoApp />}
            />

            <Route
                path={`${APP_URL}/loto-app`}
                element={<LotoApp />}
            />
        </Routes>
    );
};

export default AppRouters;