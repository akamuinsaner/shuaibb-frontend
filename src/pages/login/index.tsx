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
import { Form } from 'components/FormValidator';


const LoginPage = () => {
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
    const onLoginClick = (values) => {
        loginMutation.mutate({
            [MOBILE_REXP.test(values.uField) ? "mobile" : "email"]: values.uField,
            password: values.password
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
                        <Form
                            submit={onLoginClick}
                        >
                            <Form.Item
                                name="uField"
                                rules={[
                                    { required: true, msg: '请输入手机号' },
                                    { regex: MOBILE_REXP, msg: '请输入标准格式的手机号' }
                                ]}
                            >
                                <TextField
                                    label="手机号"
                                    margin="normal"
                                    placeholder="请输入手机号"
                                />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    { required: true, msg: '请输入密码' },
                                ]}
                            >
                                <TextField
                                    type="password"
                                    label="密码"
                                    margin="normal"
                                    autoComplete="current-password"
                                />
                            </Form.Item>
                            <Form.Submit>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    size='medium'
                                    sx={{ marginTop: '24px', marginBottom: '16px' }}
                                >登录</Button>
                            </Form.Submit>

                        </Form>

                        {/* <Box className={styles.btmLink}>
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
                        </Box> */}
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default React.memo(LoginPage);
