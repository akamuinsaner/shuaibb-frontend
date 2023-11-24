import React from 'react';
import useGlobalStore from 'globalStore';
import { uInfoAPI } from 'apis/login';
import { useQuery } from '@tanstack/react-query';
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

const App = () => {
    const updateState = useGlobalStore(state => state.updateState);
    const { data, error } = useQuery({ queryKey: [], queryFn: uInfoAPI })
    if (data) {
        updateState({ user: data })
    }
    if (error) {
        updateState({ user: null })
    }
    return <>
        <Routes>
            <Route path="/login" element={data
                ? <Navigate to="/" />
                : <LoginPage />} />
            <Route path='/signup' element={data
                ? <Navigate to="/" />
                : <Signup />} />
            <Route path='/fgtpw' element={data
                ? <Navigate to="/" />
                : <Fgtpw />} />
            <Route path="/*" element={data
                ? <Home />
                : <Navigate to="/login" />} />
        </Routes>
        <GlobalMessage />
    </>
}

export default React.memo(App);