import React from 'react';
import Box from '@mui/material/Box';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import LeftBar, { MENUCONFIG, MenuItem } from './LeftBar';
import styles from './index.module.scss'
import OrderDetail from './orderDetail';


const Appointment = () => {
    const navigate = useNavigate();
    const toPage = (path: string) => navigate(path)
    const routes = MENUCONFIG.map((menu: MenuItem) => {
        return <Route
            key={menu.key}
            path={menu.key}
            element={menu.element}
        />
    })

    return (
        <Box className={styles.page}>
            <Box className={styles.leftBar}>
                <LeftBar toPage={toPage} />
            </Box>
            <Box className={styles.main}>
                <Routes>
                    <Route index path="/" element={<Navigate to="/appointment/schedule" />} />
                    {routes}
                    <Route path='/appointment/schedule/detail' element={<OrderDetail />} />
                </Routes>
            </Box>
        </Box>
    )
}

export default React.memo(Appointment);