import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import React from 'react';
import styles from './index.module.scss';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import EmailSignUp from './emailSignUp';
import MobileSignUp from './mobileSignUp';
import {
    useSignupStore,
    initialMobileState,
    initialEmailState } from './store';

const Regis = () => {
    const loginType = useSignupStore(state => state.loginType);
    const updateState = useSignupStore(state => state.updateState);
    const navigate = useNavigate();
    React.useEffect(() => {
        updateState({
            mobileState: initialMobileState,
            emailState: initialEmailState
        })
    }, [loginType]);
    return (
        <Container
            maxWidth="xs"
        >
            <Box className={styles.content}>
                <LockOpenIcon color='info' fontSize='large' sx={{ margin: '8px' }} />
                {loginType === 'mobile' ? <MobileSignUp /> : null}
                {loginType === 'email' ? <EmailSignUp /> : null}

                <Box className={styles.btmLink}>
                    <Link
                        component="button"
                        onClick={() => navigate('/fgtpw')}
                    >忘记密码？去找回
                    </Link>
                    <Link
                        component="button"
                        onClick={() => navigate('/login')}
                    >已有账号？去登录
                    </Link>
                </Box>
            </Box>
        </Container>
    )
}

export default React.memo(Regis);