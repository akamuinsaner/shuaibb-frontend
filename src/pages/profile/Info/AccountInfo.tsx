import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import styles from './index.module.scss';
import { User } from 'declare/user';
import AddIcon from '@mui/icons-material/Add';
import AvatarCropDailog from './AvatarCropDailog';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { getBase64Image } from 'utils/funcTools';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import UpdateProfileDialog from './UpdateProfileDialog';

const AccountInfo = ({
    userInfo,
    uploadAvatar,
    updateInfo
}: {
    userInfo: User;
    uploadAvatar: (file: File) => void;
    updateInfo: (data: Partial<User>) => void;
}) => {
    const [avatarUrl, setAvatarUrl] = React.useState<string>(null);
    const [updateDialogOpen, setUpdateDialogOpen] = React.useState<boolean>(false);
    const avatarRef = React.useRef(null);
    const loadAvatar = React.useCallback((e) => {
        setAvatarUrl(e.target.result);
    }, []);
    return (
        <Paper sx={{ padding: '40px' }} className={styles.accountInfo}>
            <Typography variant='h5'>账号信息</Typography>
            <Divider sx={{ margin: '20px 0 40px' }} />
            <Box className={styles.mainContent}>
                <Box className={styles.avatarBox}>
                    <input type="file" accept="image/*" ref={avatarRef} onChange={(e) => {
                        if (e.target?.files?.length) {
                            const file = e.target?.files[0]
                            avatarRef.current.value = null;
                            const fr = new FileReader();
                            fr.readAsDataURL(file);
                            fr.onload = loadAvatar;
                        }
                    }} />
                    {!userInfo?.avatar
                        ? <Box
                            className={styles.addAvatar}
                            onClick={() => avatarRef.current.click()}
                        ><AddIcon /></Box>
                        : null}
                    {userInfo?.avatar ? <img src={userInfo.avatar} className={styles.avatar} /> : null}
                    {userInfo?.avatar ? <Box
                        className={styles.editBtn}
                        onClick={() => getBase64Image(userInfo.avatar, {
                            loadCb: setAvatarUrl
                        })}
                    >
                        <CameraAltIcon />
                        <Typography>修改头像</Typography>
                    </Box> : null}
                </Box>
                <Stack direction="column" spacing={3}>
                    <Box className={styles.profileItem}>
                        <Typography className={styles.label}>用户名</Typography>
                        <Typography>{userInfo.username || '未设置'}</Typography>
                    </Box>
                    <Box className={styles.profileItem}>
                        <Typography className={styles.label}>手机号</Typography>
                        <Typography>{userInfo.mobile || '未设置'}</Typography>
                    </Box>                    
                    <Box className={styles.profileItem}>
                        <Typography className={styles.label}>邮箱</Typography>
                        <Typography>{userInfo.email || '未设置'}</Typography>
                    </Box>
                    <Box className={styles.profileItem}>
                        <Typography className={styles.label}>昵称</Typography>
                        <Typography>{userInfo.nickname || '未设置'}</Typography>
                    </Box>
                    <Box className={styles.profileItem}>
                        <Typography className={styles.label}>个性签名</Typography>
                        <Typography>{userInfo.signature || '未设置'}</Typography>
                    </Box>
                    <Box className={styles.profileItem}>
                        <Typography className={styles.label}>地区</Typography>
                        <Typography>{userInfo.region || '未设置'}</Typography>
                    </Box>
                    <Box className={styles.profileItem}>
                        <Typography className={styles.label}>地址</Typography>
                        <Typography>{userInfo.address || '未设置'}</Typography>
                    </Box>
                    <Box className={styles.profileItem}>
                        <Typography className={styles.label}>简介</Typography>
                        <Typography>{userInfo.introduction || '未设置'}</Typography>
                    </Box>
                </Stack>
                <Button
                    startIcon={<BorderColorIcon />}
                    variant="outlined"
                    className={styles.upadateBtn}
                    onClick={() => setUpdateDialogOpen(true)}
                >修改</Button>
            </Box>
            <AvatarCropDailog
                open={!!avatarUrl}
                close={() => setAvatarUrl(null)}
                avatar={avatarUrl}
                submit={uploadAvatar}
            />
            <UpdateProfileDialog
                open={updateDialogOpen}
                close={() => setUpdateDialogOpen(false)}
                userInfo={userInfo}
                submit={updateInfo}
            />
        </Paper>
    )
}

export default React.memo(AccountInfo);
