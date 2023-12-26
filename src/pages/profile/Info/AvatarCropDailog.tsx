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
    avatar: string;
    submit: (file: File) => void;
}) => {
    const [curAvatar, setCurAvatar] = React.useState(avatar);
    const [curBlob, setCurBlob] = React.useState<File>(null);
    const cropperRef = React.useRef<ReactCropperElement>(null);
    React.useEffect(() => setCurAvatar(avatar), [open]);
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
                    src={avatar}
                    style={{ height: 500, width: 500 }}
                    initialAspectRatio={1 / 1}
                    aspectRatio={1/1}
                    checkCrossOrigin={false}
                    guides={false}
                    ref={cropperRef}
                    cropmove={(e) => {
                        console.log('move')
                        const cropper = cropperRef.current?.cropper;
                        const url = cropper.getCroppedCanvas().toDataURL();
                        cropper.getCroppedCanvas().toBlob((blob) => {
                            setCurBlob(blob as File);
                        }, 'image/jpeg', 1);
                        setCurAvatar(url);
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
