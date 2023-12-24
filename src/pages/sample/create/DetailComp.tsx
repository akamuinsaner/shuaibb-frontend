import React from 'react';
import Typography from '@mui/material/Typography';
import { uploadFileCommon } from 'apis/upload';
import styled from '@mui/material/styles/styled';
import { useMutation } from '@tanstack/react-query';
import { message } from 'components/globalMessage';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import SortIcon from '@mui/icons-material/Sort';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Popover from '@mui/material/Popover';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import SortModal from './components/SortModal'

const StyledImgMask = styled('div')({
    width: '100%',
    height: '100%',
    position: 'absolute',
    background: 'rgba(0, 0, 0, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#fff',
    opacity: 0,
    '&:hover': {
        opacity: 1
    }
})

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const DetailComp = ({
    value,
    onChange,
}: {
    value?: string[];
    onChange?: (value: string[]) => void;
}) => {
    const detailRef = React.useRef(null)
    const [anchorEl, setAnchorEl] = React.useState<any>(null);
    const [currentDetailImg, setCurrentDetailImg] = React.useState<string>('');
    const [sortDialogOpen, setSortDialogOpen] = React.useState<boolean>(false);
    const uploadMutation = useMutation({
        mutationFn: uploadFileCommon,
        onSettled: (d, e) => {
            message.success('上传成功');
            onChange([...value, d.url]);
        },
    })
    return (
        <>
            <Typography>
                样片详情图
                <Button
                    startIcon={<SortIcon />}
                    variant="contained"
                    sx={{ marginLeft: '16px' }}
                    onClick={() => setSortDialogOpen(true)}
                >
                    排序
                </Button>
                <Button
                    sx={{ marginLeft: '16px' }}
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    disabled={value.length >= 80}
                >
                    上传图片
                    <VisuallyHiddenInput ref={detailRef} type="file" onChange={e => {
                        if (e.target?.files?.length) {
                            const file = e.target?.files[0]
                            const formData = new FormData();
                            formData.append('file', file);
                            formData.append('type', 'detail');
                            uploadMutation.mutate(formData)
                        }
                    }} />
                </Button>
            </Typography>
            {
                value.length ? (
                    <>
                        <ImageList cols={8} gap={8}>
                            {
                                value.map(url => (
                                    <ImageListItem
                                        id={url}
                                        key={url}
                                    >
                                        <img src={url} />
                                        <StyledImgMask>
                                            <DeleteIcon
                                                onClick={(e) => {
                                                    setAnchorEl(e.currentTarget)
                                                    setCurrentDetailImg(url)
                                                }}
                                            />
                                        </StyledImgMask>
                                    </ImageListItem>
                                ))
                            }

                        </ImageList>
                        <Popover
                            open={!!anchorEl}
                            onClose={() => setAnchorEl(null)}
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >
                            <DialogTitle>删除</DialogTitle>
                            <DialogContent>
                                确定要删除这张图片吗？
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    variant='text'
                                    onClick={() => setAnchorEl(null)}
                                >取消</Button>
                                <Button
                                    variant='text'
                                    onClick={() => {
                                        onChange(value.filter((c => c !== currentDetailImg)));
                                        setAnchorEl(null)
                                    }}
                                >确定</Button>
                            </DialogActions>
                        </Popover>
                    </>
                ) : null
            }
            <Typography variant="overline">备注：套系详情图，最多不超过80张</Typography>
            <Dialog
                open={sortDialogOpen}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    排序（拖动排序）
                </DialogTitle>
                <DialogContent>

                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' onClick={() => setSortDialogOpen(false)}>取消</Button>
                    <Button variant='contained'>保存并下一步</Button>
                </DialogActions>
            </Dialog>
            <SortModal
                open={sortDialogOpen}
                toggleOpen={setSortDialogOpen}
                imgList={value}
                save={(details) => onChange(details)}
            />
        </>
    )
}

export default React.memo(DetailComp);
