import React from 'react';
import useGlobalStore from 'globalStore';
import { uInfoAPI } from 'apis/login';
import { useQuery, useQueries } from '@tanstack/react-query';
import {
    Routes,
    Route,
    Navigate
} from 'react-router-dom';
import LoginPage from './pages/login';
import Home from './pages/home';
import Signup from './pages/signup';
import Fgtpw from 'pages/fgtpw';
import GlobalMessage from 'components/globalMessage';
import ConfirmDialog from 'components/confirmDialog';
import LanguageProvider from 'components/Language';
import { useIsFetching } from '@tanstack/react-query';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { darkTheme, mainTheme } from 'components/Themes';
import { ThemeProvider } from '@mui/material/styles';

const App = () => {
    const loadingCount = useIsFetching();
    const updateState = useGlobalStore(state => state.updateState);
    const darkMode = useGlobalStore(state => state.darkMode);
    const userQuery = useQuery({ queryKey: ['userInfo'], queryFn: uInfoAPI })
    if (userQuery.data) {
        updateState({ user: userQuery.data })
    }
    if (userQuery.error) {
        updateState({ user: null })
    }
    if (userQuery.isPending) return null;
    return (
        <ThemeProvider theme={darkMode ? darkTheme : mainTheme}>
            <LanguageProvider>
                <GlobalMessage />
                <ConfirmDialog />
                <Routes>
                    <Route path="/login" element={userQuery.data
                        ? <Navigate to="/" />
                        : <LoginPage />} />
                    <Route path='/signup' element={userQuery.data
                        ? <Navigate to={window.location.pathname} />
                        : <Signup />} />
                    <Route path='/fgtpw' element={userQuery.data
                        ? <Navigate to={window.location.pathname} />
                        : <Fgtpw />} />
                    <Route path="/*" element={userQuery.data
                        ? <Home />
                        : <Navigate to="/login" />} />
                </Routes>
                <Backdrop sx={{ zIndex: 100 }} open={loadingCount > 0}>
                    <CircularProgress color="primary" />
                </Backdrop>
            </LanguageProvider>
        </ThemeProvider>

    )
}

export default React.memo(App);