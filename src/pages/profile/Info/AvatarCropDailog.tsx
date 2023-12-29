import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Cropper, { ReactCropperElement } from "react-cropper";
import Typography from '@mui/material/Typography';

const AvatarCropDialog = ({
    open,
    close,
    avatar,
    submit
}: {
    open: boolean;
    close: () => void;
    avatar: File;
    submit: (file: File) => void;
}) => {
    const [curBlob, setCurBlob] = React.useState<File>(null);
    const cropperRef = React.useRef<ReactCropperElement>(null);
    const [curAvatar, setCurAvatar] = React.useState<string>(null);
    React.useEffect(() => {
        if (open) setCurBlob(avatar);
    }, [open]);
    React.useEffect(() => {
        if (curBlob) setCurAvatar(URL.createObjectURL(curBlob));
    }, [curBlob]);
    return (
        <Dialog
            open={open}
            onClose={close}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>头像编辑</DialogTitle>
            <DialogContent sx={{display: 'flex' }}>
                <Cropper
                    src={avatar ? URL.createObjectURL(avatar) : ''}
                    style={{ height: 500, width: 500 }}
                    initialAspectRatio={1 / 1}
                    aspectRatio={1/1}
                    guides={false}
                    ref={cropperRef}
                    cropend={(e) => {
                        const cropper = cropperRef.current?.cropper;
                        cropper.getCroppedCanvas().toBlob((blob) => {
                            setCurBlob(blob as File);
                        }, 'image/jpeg', 1);
                    }}
                />
                <Stack direction="column" spacing={2} sx={{ marginLeft: '40px' }}>
                    <Typography variant='h6'>方形头像预览</Typography>
                    <img src={curAvatar} width={200} height={200} style={{ marginBottom: '40px' }} />
                    <Typography variant='h6'>圆形头像预览</Typography>
                    <Stack direction="row" spacing={4}>
                        <img src={curAvatar} width={100} height={100} style={{ borderRadius: '100%' }} />
                        <img src={curAvatar} width={50} height={50} style={{ borderRadius: '100%' }} />
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={close}>取消</Button>
                <Button variant='contained' onClick={() => {
                    submit(curBlob);
                    close();
                }}>确定</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(AvatarCropDialog);
