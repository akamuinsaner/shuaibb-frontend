import React from 'react';
import Stack from '@mui/material/Stack';
import AccountInfo from './AccountInfo';
import useGlobalStore from 'globalStore';
import { useMutation } from '@tanstack/react-query';
import { uploadFileCommon } from 'apis/upload';
import { editUser } from 'apis/auth/user';
import { message } from 'components/globalMessage';

const Info = () => {
    const user = useGlobalStore(state => state.user);
    const updateGlobalState = useGlobalStore(state => state.updateState);
    const updateUserMutation = useMutation({
        mutationFn: editUser,
        onSuccess: (data) => message.success('更新资料成功', {
            closeCallback: () => updateGlobalState({ user: data })
        })
    })
    const uploadAvatarMutation = useMutation({
        mutationFn: uploadFileCommon,
        onSuccess: (data) => updateUserMutation.mutate({ avatar: data.url, id: user.id })
    })
    return (
        <Stack
            direction="column"
            spacing={2}
            sx={{ padding: '20px' }}
        >
            <AccountInfo
                userInfo={user}
                uploadAvatar={(file) => {
                    const fd = new FormData();
                    fd.append('file', file);
                    fd.append('type', "avatar");
                    uploadAvatarMutation.mutate(fd);
                }}
                updateInfo={updateUserMutation.mutate}
            />
        </Stack>
    )
}

export default React.memo(Info);
