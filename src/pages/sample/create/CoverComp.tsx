import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { uploadFileCommon } from 'apis/upload';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import styled from '@mui/material/styles/styled';
import { useMutation } from '@tanstack/react-query';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { message } from 'components/globalMessage';

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

const CoverComp = ({
    value,
    onChange,
}: {
    value?: string[];
    onChange?: (value: string[]) => void;
}) => {
    const coverRef = React.useRef(null);
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
                样片封面图：封面图将显示在xxxx，图片大小不能超过3MB，尺寸使用3:4，最多上传4张
                <Button
                    sx={{ marginLeft: '16px' }}
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    disabled={value.length >= 4}
                >
                    上传图片
                    <VisuallyHiddenInput ref={coverRef} type="file" onChange={e => {
                        if (e.target?.files?.length) {
                            const file = e.target?.files[0]
                            const formData = new FormData();
                            formData.append('file', file);
                            formData.append('type', 'cover');
                            uploadMutation.mutate(formData)
                        }
                    }} />
                </Button>
            </Typography>
            {
                value.length ? (
                    <ImageList cols={8} gap={8}>
                        {
                            value.map((url: string) => (
                                <ImageListItem
                                    id={url}
                                    key={url}
                                >
                                    <img src={url} />
                                    <StyledImgMask>
                                        <DeleteIcon onClick={() => onChange(value.filter((c => c !== url)))} />
                                    </StyledImgMask>
                                </ImageListItem>
                            ))
                        }
                    </ImageList>
                ) : null
            }
        </>
    )
}

export default React.memo(CoverComp);
