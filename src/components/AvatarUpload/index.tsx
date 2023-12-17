import React from 'react';
import Box from '@mui/material/Box';
import styles from './index.module.scss';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const AvatarUpload = ({
    url,
    showLetter,
    letter,
    onUpload,
    onDelete
}: {
    url: string;
    showLetter?: boolean;
    letter: string;
    onUpload: (file: File) => void;
    onDelete: () => void;
}) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    return (
        <Box
            className={`
                ${styles.avatarUpload} 
                ${url ? styles.hasAvatar : styles.nonAvatar}`
            }
        >
            <input
                ref={inputRef}
                style={{ display: 'none' }}
                type="file"
                accept="image/*"
                onChange={(e) => {
                    const file = e.target?.files[0];
                    onUpload(file);
                    e.target.value = null;
                }} />
            {url ? <img className={styles.avatar} src={url} /> : null}
            {(!url && showLetter) ? <Box className={styles.letter}>{letter}</Box> : null}
            {!url ? <Box className={styles.uploadMask}>
                <AddIcon className={styles.addBtn} onClick={() => inputRef.current.click()} />
            </Box> : null}
            {url ? <Box className={styles.delReUpMask}>
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
