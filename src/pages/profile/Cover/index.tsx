import React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import useGlobalStore from 'globalStore';
import { useMutation } from '@tanstack/react-query';
import { addCover, removeCover, replaceCover, editUser } from 'apis/auth/user';
import { message } from 'components/globalMessage';
import Box from '@mui/material/Box';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import styles from './index.module.scss';
import { confirm } from 'components/confirmDialog';
import SortModal from 'pages/sample/create/components/SortModal';
import SortIcon from '@mui/icons-material/Sort';
import Button from '@mui/material/Button';
import Upload from 'components/Upload';
import Tooltip from '@mui/material/Tooltip';


const Cover = () => {
    const user = useGlobalStore(state => state.user);
    const [sortOpen, setSortOpen] = React.useState<boolean>(false);
    const covers = user.covers ? JSON.parse(user.covers) : [];
    const updateGlobalState = useGlobalStore(state => state.updateState);
    const editUserMutation = useMutation({
        mutationFn: editUser,
        onSuccess: (data) => message.success('排序封面成功', {
            closeCallback: () => updateGlobalState({ user: data })
        })
    })
    const addCoverMutation = useMutation({
        mutationFn: addCover,
        onSuccess: (data) => message.success('添加封面成功', {
            closeCallback: () => updateGlobalState({ user: data })
        })
    })
    const removeCoverMutation = useMutation({
        mutationFn: removeCover,
        onSuccess: (data) => message.success('移除封面成功', {
            closeCallback: () => updateGlobalState({ user: data })
        })
    })
    const replaceCoverMutation = useMutation({
        mutationFn: replaceCover,
        onSuccess: (data) => message.success('替换封面成功', {
            closeCallback: () => updateGlobalState({ user: data })
        })
    })
    const imgListRef = React.useRef<HTMLUListElement>(null);
    const [colCount, setColCount] = React.useState(6);
    const [imgHeight, setImgHeight] = React.useState(0);
    const countWidth = () => {
        const wrapper = imgListRef.current;
        if (wrapper) {
            const width = wrapper.offsetWidth;
            const imgWidth = width / colCount;
            let newColCount = colCount;
            if (imgWidth > 300) newColCount += 1;
            if (imgWidth < 200) newColCount -= 1;
            setColCount(newColCount);
            setImgHeight(width / newColCount);
        }
    }

    React.useEffect(() => {
        window.addEventListener('resize', countWidth);
        countWidth();
        return () => {
            window.removeEventListener('resize', countWidth);
        }
    }, []);
    return (
        <Stack
            direction="column"
            spacing={2}
            className={styles.page}
        >
            <Paper sx={{ padding: '40px' }}>
                <Stack direction="row" alignItems="flex-end">
                    <Typography variant='h5'>封面</Typography>
                    <Typography variant='body1'>（不超过50张，封面图片尺寸建议3:2比例）</Typography>
                    <Button
                        startIcon={<SortIcon />}
                        variant="contained"
                        sx={{ marginLeft: 'auto' }}
                        onClick={() => setSortOpen(true)}
                    >
                        排序
                    </Button>
                </Stack>

                <Divider sx={{ margin: '20px 0 40px' }} />
                <ImageList cols={colCount} rowHeight={imgHeight} ref={imgListRef}>
                    <Upload
                        accept="image/*"
                        action={addCoverMutation.mutate}
                    >
                        <ImageListItem
                            component={Paper}
                            className={styles.uploadItem}
                        >
                            <CameraAltIcon />
                            <Typography variant='body1'>点击上传</Typography>
                        </ImageListItem>
                    </Upload>
                    {covers.map(cover => <ImageListItem
                        key={cover}
                        className={styles.imgItem}
                    >
                        <img src={cover} loading="lazy" className={styles.cover} />
                        <Box className={styles.mask}>
                            <Upload
                                accept="image/*"
                                action={replaceCoverMutation.mutate}
                                data={(file) => ({ file, old: cover })}
                            >
                                <Tooltip title="重新上传"><CloudUploadIcon htmlColor='#fff' /></Tooltip>
                            </Upload>
                            <Tooltip title="删除">
                                <DeleteOutlineIcon
                                    htmlColor='#fff'
                                    onClick={() => confirm.confirm({
                                        title: '删除',
                                        content: '删除后不可恢复，确认要删除这张封面吗？',
                                        confirmCallback: () => removeCoverMutation.mutate({
                                            cover,
                                            id: user.id
                                        })
                                    })}
                                />
                            </Tooltip>

                        </Box>
                    </ImageListItem>)}
                </ImageList>
            </Paper>
            <SortModal
                open={sortOpen}
                toggleOpen={setSortOpen}
                imgList={covers}
                save={(list) => editUserMutation.mutate({
                    id: user.id,
                    covers: JSON.stringify(list)
                })}
            />
        </Stack>
    )
}

export default React.memo(Cover);
