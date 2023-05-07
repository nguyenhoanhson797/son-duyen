import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { APP_URL } from '../constants/app-config';
import AppLayout from './AppLayout';

const AppRouters = () => {
    return (
        <Routes>
            <Route
                path={APP_URL}
                element={<AppLayout />}
            />
      </Routes>
    );
};

export default AppRouters;