import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import React from 'react';
import styles from './index.module.scss';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { MOBILE_REXP } from 'common/rexps';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { signupApi } from 'apis/login';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { message } from 'components/globalMessage';

const Regis = () => {
    const [mobile, setMobile] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = React.useState<string>('');
    const [mbErrText, setMbErrText] = React.useState<string>('');
    const [pwErrText, setPwErrText] = React.useState<string>('');
    const [pwCfErrText, setPwCfErrText] = React.useState<string>('');
    React.useEffect(() => {
        if (mobile && !MOBILE_REXP.test(mobile)) {
            setMbErrText('请输入正确的手机号');
        } else {
            setMbErrText('');
        }
    }, [mobile]);
    React.useEffect(() => {
        if (password !== passwordConfirm) {
            setPwErrText('两次密码输入不一致')
            setPwCfErrText('');
        } else {
            setPwErrText('')
            setPwCfErrText('');
        }
    }, [password, passwordConfirm]);
    const navigate = useNavigate();
    const signupMutation = useMutation({
        mutationFn: signupApi,
        onSuccess: (data) => {
            message.success('注册成功', {
                closeCallback: () => navigate('/login')
            })
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
        if (!pwCfErrText) {
            setPwCfErrText('密码不能为空');
            return;
        }
        signupMutation.mutate({
            mobile,
            password,
            password_confirm: passwordConfirm
        })
    }
    return (
        <Container
            maxWidth="xs"
        >
            <Box className={styles.content}>
                <LockOpenIcon color='info' fontSize='large' sx={{ margin: '8px' }} />
                <Typography variant='h5' >注册</Typography>
                <TextField
                    error={!!mbErrText}
                    required
                    label="手机号"
                    fullWidth
                    placeholder='请输入手机号'
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
                    placeholder='请输入密码'
                    fullWidth
                    margin="normal"
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    helperText={pwErrText}
                />
                <TextField
                    type="password"
                    required
                    label="确认密码"
                    placeholder='请确认密码'
                    fullWidth
                    margin="normal"
                    autoComplete="current-password"
                    value={passwordConfirm}
                    onChange={e => setPasswordConfirm(e.target.value)}
                />
                <Button
                    variant="contained"
                    fullWidth
                    size='medium'
                    sx={{ marginTop: '24px', marginBottom: '16px' }}
                    onClick={onLoginClick}
                >注册</Button>
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