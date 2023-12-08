import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box';
import { PictureInfo } from 'declare/picture'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Cropper, { ReactCropperElement } from "react-cropper";
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import NumberInput, { InputAdornment } from 'components/NumberInput'
import { SampleLabel } from 'declare/sample';


const PictureEditDrawer = ({
    open,
    close,
    pictureInfo,
    onUpload,
    onCover,
    curFolderId,
    labels
}: {
    open: boolean;
    close: () => void;
    pictureInfo: PictureInfo
    onUpload: (data: any) => void
    onCover: (data: any) => void
    curFolderId: any;
    labels: SampleLabel[]
}) => {
    const initWidth = 5;
    const initHeight = 10;
    const [labelIds, setLabelIds] = React.useState([]);
    const [name, setName] = React.useState<string>('');
    const [scaleX, setScaleX] = React.useState(1);
    const [scaleY, setScaleY] = React.useState(1);
    const [height, setHeight] = React.useState(10);
    const [width, setWidth] = React.useState(5);
    const cropperRef = React.useRef<ReactCropperElement>(null);
    const rotate = (type: 'r' | 'l') => {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        cropper.rotate(type === 'r' ? 90 : -90);
    };
    const flip = (type: 'h' | 'v') => {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        if (type === "h") {
            cropper.scaleX(scaleX === 1 ? -1 : 1);
            setScaleX(scaleX === 1 ? -1 : 1);
        } else {
            cropper.scaleY(scaleY === 1 ? -1 : 1);
            setScaleY(scaleY === 1 ? -1 : 1);
        }
    };
    React.useEffect(() => {
        if (open) {
            setName(pictureInfo?.name);
            setHeight(initHeight)
            setWidth(initWidth)
            setLabelIds(pictureInfo.labels.map(item => item.id))
        }
    }, [open])

    const onSelect = (e: any) => {
        const value = Number(e.target.value);
        setWidth(value * height);
    }

    React.useEffect(() => {
        if (cropperRef.current) {
            const cropper = cropperRef.current?.cropper;
            cropper.setAspectRatio(width / height)
        }
    }, [width, height]);

    const handleParams = (callback: (params: any) => void) => {
        const cropper = cropperRef.current?.cropper;
        cropper.getCroppedCanvas().toBlob(blob => {
            const fr = new FileReader();
            fr.onload = (e) => {
                const img = new Image();
                img.src = e.target.result as string;
                img.onload = (e) => {
                    callback({
                        file: blob,
                        size: blob.size,
                        width: img.width,
                        height: img.height
                    })
                }
            }
            fr.readAsDataURL(blob)
        }, `image/${pictureInfo.ext === '.png' ? 'png' : 'jpeg'}`, 1)
    }

    const onSubmit1 = () => {
        handleParams((data) => {
            if (curFolderId) data['folder_id'] = curFolderId
            onCover({...data, id: pictureInfo.id, label_ids: labelIds })
            close()
        })
    }
    const onSubmit2 = () => {
        handleParams((data) => {
            if (curFolderId) data['folder_id'] = curFolderId
            onUpload({...data, name: `${name}${pictureInfo.ext}`, label_ids: labelIds })
            close();
        })
    }
    return (
        <Dialog
            open={open}
            onClose={close}
            maxWidth="xl"
            fullWidth
        >
            <DialogTitle>编辑图片</DialogTitle>
            <DialogContent sx={{ padding: '24px !important' }}>
                <Stack direction="row" spacing={4}>
                    <Cropper
                        src={pictureInfo?.url}
                        style={{ height: 700, width: 700 }}
                        initialAspectRatio={width / height}
                        guides={false}
                        ref={cropperRef}
                    />
                    <Stack sx={{ flex: 1 }} spacing={4}>
                        <TextField
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            label="图片名称"
                        />
                        <TextField
                            fullWidth
                            label="标签"
                            select
                            value={labelIds}
                            onChange={(e) => setLabelIds(e.target.value as any)}
                            SelectProps={{
                                multiple: true
                            }}
                        >
                            {labels.map(label => (
                                <MenuItem key={label.id} value={label.id}>{label.name}</MenuItem>
                            ))}
                        </TextField>
                        <Stack direction="row" spacing={2}>
                            <TextField
                                select
                                SelectProps={{}}
                                value={width / height}
                                onChange={onSelect}
                                sx={{ flex: 1 }}
                            >
                                <MenuItem value={0.5}>自由裁剪</MenuItem>
                                <MenuItem value={0.75}>默认裁剪（3:4）</MenuItem>
                                <MenuItem value={1}>1:1</MenuItem>
                                <MenuItem value={0.5625}>9:16</MenuItem>
                            </TextField>
                            <NumberInput
                                value={width}
                                onChange={(event, val) => setWidth(val)}
                                startAdornment={<InputAdornment>宽</InputAdornment>}
                            />
                            <NumberInput
                                value={height}
                                onChange={(event, val) => setHeight(val)}
                                startAdornment={<InputAdornment>高</InputAdornment>}
                            />
                        </Stack>
                        <ButtonGroup
                            variant='contained'
                            size='large'
                            sx={{ alignItems: 'baseline' }}
                        >
                            <Button startIcon={<SwapVertIcon />} onClick={() => flip('v')}>竖直翻转</Button>
                            <Button startIcon={<SwapHorizIcon />} onClick={() => flip('h')}>水平翻转</Button>
                            <Button startIcon={<RotateLeftIcon />} onClick={() => rotate('l')}>左旋90°</Button>
                            <Button startIcon={<RotateRightIcon />} onClick={() => rotate('r')}>右旋90°</Button>
                        </ButtonGroup>
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="text"
                    onClick={close}
                >
                    取消
                </Button>
                <Button
                    variant='outlined'
                    sx={{ margin: '0 10px' }}
                    onClick={onSubmit1}
                >覆盖原图</Button>
                <Button
                    variant='contained'
                    onClick={onSubmit2}
                >另存图片</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(PictureEditDrawer);
