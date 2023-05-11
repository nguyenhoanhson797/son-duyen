import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './AppLayout';
import InviteCard from './InviteCard';
import { APP_URL } from '../constants/app-config';

const AppRouters = () => {
    return (
        <Routes>
            <Route
                path={'/'}
                element={<AppLayout />}
            />

            <Route
                path={APP_URL}
                element={<AppLayout />}
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