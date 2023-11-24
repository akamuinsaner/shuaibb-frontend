import React from 'react';
import Box from '@mui/material/Box';
import styles from './index.module.scss';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { loginAPI } from 'apis/login';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import useGlobalStore from 'globalStore';
import { MOBILE_REXP } from 'common/rexps';

const Fgtpw = () => {
    const [mobile, setMobile] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [mbErrText, setMbErrText] = React.useState<string>('');
    const [pwErrText, setPwErrText] = React.useState<string>('');
    React.useEffect(() => {
        if (mobile && !MOBILE_REXP.test(mobile)) {
            setMbErrText('请输入正确的手机号');
        } else {
            setMbErrText('');
        }
    }, [mobile]);
    const updateGlobalState = useGlobalStore((state) => state.updateState)
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const loginMutation = useMutation({
        mutationFn: loginAPI,
        onSuccess: (token) => {
            localStorage.setItem('__token__', token);
            window.location.reload();
        },
        onError: (error) => {
            setMbErrText(error.message);
        }
    });
    const onLoginClick = () => {
        if (!mobile) {
            setMbErrText('手机号码不能为空');
            return;
        }
        if (!password) {
            setPwErrText('密码不能为空');
            return;
        }
        loginMutation.mutate({ mobile, password })
    }
    return (
        <Box className={styles.loginPage}>
            <Box className={styles.rightBox}>
                <Box
                    className={styles.loginBox}
                >
                    <LockOpenIcon color='info' fontSize='large' sx={{ margin: '8px' }} />
                    <Typography variant='h5' >登录</Typography>
                    <Box sx={{ marginTop: '8px', width: '100%' }}>
                        <TextField
                            error={!!mbErrText}
                            required
                            label="手机号"
                            fullWidth
                            margin="normal"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            helperText={mbErrText}
                        />
                        <TextField
                            error={!!pwErrText}
                            type="password"
                            required
                            label="密码"
                            fullWidth
                            margin="normal"
                            autoComplete="current-password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            helperText={pwErrText}
                        />
                        <Button
                            variant="contained"
                            fullWidth
                            size='medium'
                            sx={{ marginTop: '24px', marginBottom: '16px' }}
                            onClick={onLoginClick}
                        >登录</Button>
                        <Box className={styles.btmLink}>
                            <Link
                                component="button"
                                onClick={() => navigate('/fgtpw')}
                            >忘记密码？
                            </Link>
                            <Link
                                component="button"
                                onClick={() => navigate('/signup')}
                            >没有账号？去注册
                            </Link>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default React.memo(Fgtpw);
