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
import BorderColorIcon from '@mui/icons-material/BorderColor';
import UpdateProfileDialog from './UpdateProfileDialog';
import Upload from 'components/Upload';

const AccountInfo = ({
    userInfo,
    uploadAvatar,
    updateInfo,
    areaList
}: {
    userInfo: User;
    uploadAvatar: (file: File) => void;
    updateInfo: (data: Partial<User>) => void;
    areaList: any[]
}) => {
    const [avatar, setAvatar] = React.useState<File>(null);
    const [updateDialogOpen, setUpdateDialogOpen] = React.useState<boolean>(false);

    const renderRegion = (areaList, list, result = []) => {
        const code = list.shift();
        const a = areaList.find(a => `${a.id}` === `${code}`);
        if (!a) return result;
        result.push(a.name)
        if (a.children && a.children.length && list.length) {
            return renderRegion(a.children, list, result);
        } else {
            return result;
        }
    }

    return (
        <Paper sx={{ padding: '40px' }} className={styles.accountInfo}>
            <Typography variant='h5'>账号信息</Typography>
            <Divider sx={{ margin: '20px 0 40px' }} />
            <Box className={styles.mainContent}>
                <Box className={styles.avatarBox}>
                    {!userInfo?.avatar
                        ? <Upload
                            accept="image/*"
                            onChange={setAvatar}
                        ><Box className={styles.addAvatar}><AddIcon /></Box></Upload>
                        : null}
                    {userInfo?.avatar ? <img src={userInfo.avatar} className={styles.avatar} /> : null}
                    {userInfo?.avatar ?
                        <Upload
                            accept="image/*"
                            onChange={setAvatar}
                        >
                            <Box
                                className={styles.editBtn}
                            >
                                <CameraAltIcon />
                                <Typography>修改头像</Typography>
                            </Box>
                        </Upload>
                        : null}
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
                        <Typography>
                            {userInfo.region && renderRegion(areaList, JSON.parse(userInfo.region)) || '未设置'}
                        </Typography>
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
                open={!!avatar}
                close={() => setAvatar(null)}
                avatar={avatar}
                submit={uploadAvatar}
            />
            <UpdateProfileDialog
                open={updateDialogOpen}
                close={() => setUpdateDialogOpen(false)}
                userInfo={userInfo}
                submit={updateInfo}
                areaList={areaList}
            />
        </Paper>
    )
}

export default React.memo(AccountInfo);
