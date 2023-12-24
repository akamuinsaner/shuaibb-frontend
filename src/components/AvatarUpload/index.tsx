import React from 'react';
import Box from '@mui/material/Box';
import styles from './index.module.scss';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { uploadFileCommon } from 'apis/upload';
import { useMutation } from '@tanstack/react-query';
import { message } from 'components/globalMessage';

const AvatarUpload = ({
    value,
    showLetter,
    letter,
    onChange,
    onDelete
}: {
    value?: string;
    showLetter?: boolean;
    letter?: string;
    onChange?: (url: string) => void;
    onDelete?: () => void;
}) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const uploadFileMutation = useMutation({
        mutationFn: uploadFileCommon,
        onSuccess: (res) => {
            message.success('上传头像成功');
            onChange(res.url)
        }
    })
    return (
        <Box
            className={`
                ${styles.avatarUpload} 
                ${value ? styles.hasAvatar : styles.nonAvatar}`
            }
        >
            <input
                ref={inputRef}
                style={{ display: 'none' }}
                type="file"
                accept="image/*"
                onChange={(e) => {
                    const file = e.target?.files[0];
                    const fd = new FormData();
                    fd.append('file', file);
                    fd.append('type', 'avatar');
                    uploadFileMutation.mutate(fd);
                    e.target.value = null;
                }} />
            {value ? <img className={styles.avatar} src={value} /> : null}
            {(!value && showLetter) ? <Box className={styles.letter}>{letter}</Box> : null}
            {!value ? <Box className={styles.uploadMask}>
                <AddIcon className={styles.addBtn} onClick={() => inputRef.current.click()} />
            </Box> : null}
            {value ? <Box className={styles.delReUpMask}>
                <Tooltip title="重新上传"><FileUploadIcon
                    htmlColor='#fff'
                    onClick={() => inputRef.current.click()}
                /></Tooltip>
                <Tooltip title="删除"><DeleteOutlineIcon
                    htmlColor='#fff'
                    onClick={onDelete}
                /></Tooltip>
            </Box> : null}
        </Box>
    )
}

export default React.memo(AvatarUpload);
