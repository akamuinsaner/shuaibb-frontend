import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Button from '@mui/material/Button';
import { useSignupStore } from './store';
import { MOBILE_REXP } from 'common/rexps';
import { useMutation } from '@tanstack/react-query';
import { signupApi } from 'apis/login';
import { message } from 'components/globalMessage';
import { useNavigate } from 'react-router-dom';

const MobileSignUp = () => {
    const {
        mobile,
        password,
        passwordConfirm,
        mbErrText,
        pwErrText,
        pwcfErrText
    } = useSignupStore(state => state.mobileState);
    const navigate = useNavigate();
    const updateState = useSignupStore(state => state.updateState)
    const updateMobileState = useSignupStore(state => state.updateMobileState)
    React.useEffect(() => {
        if (mobile && !MOBILE_REXP.test(mobile)) {
            updateMobileState({ mbErrText: '请输入正确的手机号' });
        } else {
            updateMobileState({ mbErrText: '' });
        }
    }, [mobile]);
    React.useEffect(() => {
        if (password !== passwordConfirm) {
            updateMobileState({ pwErrText: '两次密码输入不一致' })
        } else {
            updateMobileState({ pwErrText: '' })
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
        if (!mobile) {
            updateMobileState({ mbErrText: '手机号码不能为空'});
            return;
        }
        if (!password) {
            updateMobileState({ pwErrText: '密码不能为空' });
            return;
        }
        if (!passwordConfirm) {
            updateMobileState({ pwcfErrText: '确认密码不能为空' });
            return;
        }
        signupMutation.mutate({
            loginType: 'mobile',
            mobile: mobile,
            password: password,
            passwordConfirm: passwordConfirm
        })
    }
    return (
        <>
            <Typography variant='h5' >手机号注册</Typography>
            <Button
                variant='text'
                size='small'
                endIcon={<KeyboardDoubleArrowRightIcon />}
                onClick={() => updateState({ loginType: 'email' })}
            >前往邮箱注册</Button>
            <TextField
                error={!!mbErrText}
                required
                label="手机号"
                fullWidth
                placeholder='请输入手机号'
                margin="normal"
                value={mobile}
                onChange={(e) => updateMobileState({ mobile: e.target.value })}
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
                onChange={e => updateMobileState({ password: e.target.value })}
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
                onChange={e => updateMobileState({ passwordConfirm: e.target.value })}
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

export default React.memo(MobileSignUp);