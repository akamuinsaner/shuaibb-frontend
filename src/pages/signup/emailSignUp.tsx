import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { useSignupStore } from './store';
import TextField from '@mui/material/TextField';
import { EMAIL_REXP } from 'common/rexps';
import { useMutation } from '@tanstack/react-query';
import { signupApi } from 'apis/login';
import { message } from 'components/globalMessage';
import { useNavigate } from 'react-router-dom';

const EmailSignUp = () => {
    const loginType = useSignupStore(state => state.loginType);
    const updateState = useSignupStore(state => state.updateState);
    const {
        email,
        password,
        passwordConfirm,
        elErrText,
        pwErrText,
        pwcfErrText
    } = useSignupStore(state => state.emailState);
    const navigate = useNavigate();
    const updateEmailState = useSignupStore(state => state.updateEmailState);
    React.useEffect(() => {
        if (email && !EMAIL_REXP.test(email)) {
            updateEmailState({ elErrText: '请输入正确的邮箱' });
        } else {
            updateEmailState({ elErrText: '' });
        }
    }, [email]);
    React.useEffect(() => {
        if (password !== passwordConfirm) {
            updateEmailState({ pwErrText: '两次密码输入不一致' })
        } else {
            updateEmailState({ pwErrText: '' })
        }
    }, [password, passwordConfirm]);
    const signupMutation = useMutation({
        mutationFn: signupApi,
        onSuccess: (data) => {
            message.success('注册成功', {
                closeCallback: () => navigate('/login')
            })
        },
        onError: (error) => {
            message.error(error.message)
        }
    });
    const onLoginClick = () => {
        if (loginType === 'email') {
            if (!email) {
                updateEmailState({ elErrText: '邮箱不能为空'});
                return;
            }
            if (!password) {
                updateEmailState({ pwErrText: '密码不能为空' });
                return;
            }
            if (!passwordConfirm) {
                updateEmailState({ pwcfErrText: '确认密码不能为空' });
                return;
            }
            signupMutation.mutate({
                loginType: 'email',
                email,
                password,
                passwordConfirm
            })
            return;
        }
    }
    return (
        <>
            <Typography variant='h5' >邮箱注册</Typography>
            <Button
                variant='text'
                size='small'
                endIcon={<KeyboardDoubleArrowRightIcon />}
                onClick={() => updateState({ loginType: 'mobile' })}
            >前往手机号注册</Button>
            <TextField
                error={!!elErrText}
                required
                label="邮箱"
                fullWidth
                placeholder='请输入邮箱'
                margin="normal"
                value={email}
                onChange={(e) => updateEmailState({ email: e.target.value })}
                helperText={elErrText}
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
                onChange={e => updateEmailState({ password: e.target.value })}
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
                onChange={e => updateEmailState({ passwordConfirm: e.target.value })}
            />
            <Button
                variant="contained"
                fullWidth
                size='medium'
                sx={{ marginTop: '24px', marginBottom: '16px' }}
                onClick={onLoginClick}
            >注册</Button>
        </>
    )
}

export default React.memo(EmailSignUp);