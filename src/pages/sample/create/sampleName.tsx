import React from 'react';
import { Item } from './item';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import styled from '@mui/material/styles/styled';
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
import { SampleNameState } from './store';
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

const SampleName = ({
    data,
    updateData
}: {
    data: SampleNameState,
    updateData: (data: Partial<SampleNameState>)  => void
}) => {
    const [anchorEl, setAnchorEl] = React.useState<any>(null);
    const [currentDetailImg, setCurrentDetailImg] = React.useState<string>('');
    const [sortDialogOpen, setSortDialogOpen] = React.useState<boolean>(false);
    return (
        <Item elevation={3}>
            <Stack spacing={2}>
                <Typography>样片名称</Typography>
                <TextField
                    required
                    fullWidth
                    label="样片名称"
                    placeholder='最多允许输入30个汉字'
                    size='small'
                    value={data.name}
                    onChange={e => updateData({ name: e.target.value })}
                />
                <TextField
                    required
                    fullWidth
                    label="样片标签"
                    placeholder='最多选择5个标签'
                    size='small'
                    select
                    SelectProps={{
                        multiple: true
                    }}
                    value={data.tags}
                />
                <TextField
                    required
                    fullWidth
                    label="样片描述"
                    placeholder='请为大家介绍一下样片吧'
                    size='small'
                    value={data.desc}
                    onChange={e => updateData({ desc: e.target.value })}
                />
                <Item>
                    <Stack spacing={2}>
                        <Typography>
                            *样片封面图：封面图将显示在xxxx，图片大小不能超过3MB，尺寸使用3:4，最多上传4张
                            <Button
                                sx={{ marginLeft: '16px' }}
                                component="label"
                                variant="contained"
                                startIcon={<CloudUploadIcon />}
                                disabled={data.covers.length >= 4}
                            >
                                上传图片
                                <VisuallyHiddenInput type="file" />
                            </Button>
                        </Typography>
                        {
                            data.covers.length ? (
                                <ImageList cols={8} gap={8}>
                                    {
                                        data.covers.map((url: string) => (
                                            <ImageListItem
                                                id={url}
                                                key={url}
                                            >
                                                <img src={url} />
                                                <StyledImgMask>
                                                    <DeleteIcon onClick={() => {
                                                        updateData({
                                                            covers: data.covers.filter((c => c !== url))
                                                        })
                                                    }} />
                                                </StyledImgMask>
                                            </ImageListItem>
                                        ))
                                    }
                                </ImageList>
                            ) : null
                        }
                        <Typography>
                            *样片详情图
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
                                disabled={data.details.length >= 80}
                            >
                                上传图片
                                <VisuallyHiddenInput type="file" />
                            </Button>
                        </Typography>
                        {
                            data.details.length ? (
                                <>
                                    <ImageList cols={8} gap={8}>
                                        {
                                            data.details.map(url => (
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
                                                    updateData({
                                                        details: data.details.filter((c => c !== currentDetailImg))
                                                    });
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
                    </Stack>
                </Item>
            </Stack>
            <SortModal
                open={sortDialogOpen}
                toggleOpen={setSortDialogOpen}
                imgList={data.details}
                save={(details) => updateData({ ...data, details })}
            />
        </Item>
    )
}

export default React.memo(SampleName);