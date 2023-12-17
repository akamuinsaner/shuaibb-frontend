import React from 'react';
import Box from '@mui/material/Box';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import LeftBar, { MENUCONFIG, MenuItem } from './LeftBar';
import styles from './index.module.scss'

const Auth = () => {
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
                    <Route index path="/" element={<Navigate to="/auth/group" />} />
                    {routes}
                </Routes>
            </Box>
        </Box>
    )
}

export default React.memo(Auth);