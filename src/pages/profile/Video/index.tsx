import React from 'react';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import styles from './index.module.scss';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

const Video = () => {
    const imgListRef = React.useRef<HTMLUListElement>(null);
    const [imgHeight, setImgHeight] = React.useState(0);
    const [colCount, setColCount] = React.useState(4);

    const countWidth = () => {
        const wrapper = imgListRef.current;
        if (wrapper) {
            const width = wrapper.offsetWidth;
            const imgWidth = width / colCount;
            setImgHeight(imgWidth / 16 * 9);
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
                <Typography variant='h5'>首页视频</Typography>
                <Divider sx={{ margin: '20px 0 40px' }} />
                <Stack direction="row" spacing={2}>
                    <Button
                        startIcon={<AddIcon />}
                        color="secondary"
                        variant='outlined'
                    >添加视频外链</Button>
                    <Button
                        variant='outlined'
                        startIcon={<AddIcon />}
                    >上传本地视频</Button>
                </Stack>
                <ImageList cols={colCount} rowHeight={imgHeight} ref={imgListRef}>
                    
                </ImageList>
            </Paper>
        </Stack>
    )
}

export default React.memo(Video);