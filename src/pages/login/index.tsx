import React from 'react';
import Box from '@mui/material/Box';
import styles from './index.module.scss';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { loginAPI } from 'apis/login';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { MOBILE_REXP, EMAIL_REXP } from 'common/rexps';
import { message } from 'components/globalMessage'
import { useLoginStore } from './store';

const LoginPage = () => {
    const {
        uField,
        password,
        uFieldErrText,
        pwErrText
    } = useLoginStore(state => state);
    const updateState = useLoginStore(state => state.updateState);
    React.useEffect(() => {
        if (uField &&
            !MOBILE_REXP.test(uField) &&
            !EMAIL_REXP.test(uField)) {
            updateState({ uFieldErrText: '请输入正确的账号' })
        } else {
            updateState({ uFieldErrText: '' })
        }
    }, [uField]);
    const navigate = useNavigate();
    const loginMutation = useMutation({
        mutationFn: loginAPI,
        onSuccess: (token) => {
            localStorage.setItem('__token__', token);
            message.success('登录成功', {
                closeCallback: () => window.location.reload(),
            })
        },
        onError: (error) => {
            message.error(error.message)
        }
    });
    const onLoginClick = () => {
        if (uFieldErrText || pwErrText) return;
        if (!uField) { updateState({ uFieldErrText: '账号不能为空' }); return; }
        if (!password) { updateState({ pwErrText: '密码不能为空' }); return; }
        loginMutation.mutate({
            [MOBILE_REXP.test(uField) ? "mobile" : "email"]: uField,
            password
        })
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
                            error={!!uFieldErrText}
                            required
                            label="手机号或邮箱"
                            fullWidth
                            margin="normal"
                            value={uField}
                            placeholder="请输入手机号或邮箱登录"
                            onChange={(e) => updateState({ uField: e.target.value })}
                            helperText={uFieldErrText}
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
                            onChange={e => updateState({ password: e.target.value })}
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
                            >忘记密码？去找回
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

export default React.memo(LoginPage);
