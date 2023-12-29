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
import { useTranslation } from 'react-i18next';
import Upload from 'components/Upload';

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

const CoverComp = ({
    value,
    onChange,
}: {
    value?: string[];
    onChange?: (value: string[]) => void;
}) => {
    const { t } = useTranslation();
    const uploadMutation = useMutation({
        mutationFn: uploadFileCommon,
        onSettled: (d, e) => {
            message.success(t('upload success'));
            onChange([...value, d.url]);
        },
    })

    return (
        <>
            <Typography>
                {t('sample sovers')}：{t('sample sovers tips')}
                <Upload
                    accept='image/*'
                    data={(file) => ({ file, type: 'cover' })}
                    action={uploadMutation.mutate}
                    disabled={value.length >= 4}
                >
                    <Button
                        sx={{ marginLeft: '16px' }}
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                    >
                        {t('upload')}
                    </Button>
                </Upload>

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
