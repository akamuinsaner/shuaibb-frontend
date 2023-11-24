import React from 'react';
import './index.module.scss';
import Box from '@mui/material/Box';
import LeftBar, { MENUCONFIG, MenuItem } from './leftBar';
import TopBar from './TopBar';
import styles from './index.module.scss';
import { Navigate, Route, Routes } from 'react-router-dom'

const Home = () => {
  const routes = MENUCONFIG.map((menu: MenuItem) => {
    return <Route
      key={menu.key}
      path={menu.path}
      element={menu.element}
    ></Route>
  })
  return (
    <Box className={styles.home}>
      <Box className={styles.leftBar}>
        <LeftBar />
      </Box>
      <Box className={styles.right}>
        <TopBar />
          <Box className={styles.main}>
            <Routes>
              <Route index path="/" element={<Navigate to="/home" />} />
              {routes}
            </Routes>
          </Box>
      </Box>
    </Box>
  );
}

export default React.memo(Home);
