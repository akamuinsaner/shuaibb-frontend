import React from 'react';
import styles from './index.module.scss';
import Grid from '@mui/material/Grid';
import FolderIcon from '@mui/icons-material/Folder';
import Typography from '@mui/material/Typography';
import { PictureFolder } from 'declare/picture/index';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { state } from './store';
import Checkbox from '@mui/material/Checkbox';

const PictureGridMode = ({
    pictures = [],
    showFolders = [],
    onClickFolder,
    onDelete,
    selectedFolders,
    selectedImages,
    setSelectedFolders,
    setSelectedImages,
    folderIds,
    updateFolderIds,
    openRenameDialog,
    openMoveDialog
}: {
    showFolders: state["folders"];
    pictures: state["pictures"];
    onClickFolder: (id: any) => void
    onDelete: (name: string, id: number) => void;
    selectedFolders: number[];
    selectedImages: number[];
    setSelectedFolders: (data: number[]) => void;
    setSelectedImages: (data: number[]) => void;
    updateFolderIds: (ids: any[]) => void;
    folderIds: state["folderIds"];
    openRenameDialog: (name: string, type: 'pic' | 'folder', id: number) => void
    openMoveDialog: (data: { id: number; type: 'pic' | 'folder'; parentId: number }) =>void
}) => {
    return (
        <Grid container spacing={2}>
            {folderIds.length > 1 ? <Grid
                item
                xs={2}
                className={`${styles.showItem} ${styles.folderItem}`}
                sx={{ marginBottom: '40px' }}
            >
                <Box className={styles.showItemBox}>
                    <div onDoubleClick={() => {
                        folderIds.pop();
                        updateFolderIds(folderIds);
                    }}>
                        <FolderIcon
                            className={styles.folder}
                            htmlColor="#FFCF4A"
                        />
                    </div>
                </Box>
                <Typography className={styles.name}>..</Typography>
            </Grid> : null}
            {showFolders.map((folder) => {
                return <Grid
                    item
                    xs={2}
                    key={folder.id}
                    className={`${styles.showItem} ${styles.folderItem}`}
                    sx={{ marginBottom: '40px' }}
                >
                    <Box className={styles.showItemBox}>
                        <Checkbox
                            className={`
                        ${styles.checkBox} 
                        ${selectedFolders.includes(folder.id) ? styles.checked : ''}`}
                            checked={selectedFolders.includes(folder.id)}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedFolders([...selectedFolders, folder.id])
                                } else {
                                    setSelectedFolders(selectedFolders.filter(item => item !== folder.id))
                                }
                            }}
                        />
                        <div onDoubleClick={() => onClickFolder(folder.id)}>
                            <FolderIcon
                                className={styles.folder}
                                htmlColor="#FFCF4A"
                            />
                        </div>
                    </Box>
                    <Typography className={styles.name}>{folder.name}</Typography>
                </Grid>
            })}
            {pictures.map(picture => {
                return <Grid
                    item xs={2}
                    key={picture.id}
                    className={`${styles.showItem} ${styles.imgItem}`}
                    sx={{ marginBottom: '40px' }}
                >
                    <Box className={styles.showItemBox}>
                        <Checkbox
                            className={`
                            ${styles.checkBox} 
                            ${selectedImages.includes(picture.id) ? styles.checked : ''}`}
                            checked={selectedImages.includes(picture.id)}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedImages([...selectedImages, picture.id])
                                } else {
                                    setSelectedImages(selectedImages.filter(item => item !== picture.id))
                                }
                            }}
                        />
                        <img
                            src={picture.url}
                            onDoubleClick={() => {
                                console.log('11111111111')
                            }}
                        />
                        <Box className={styles.btmActions}>
                            <Tooltip title="删除图片">
                                <DeleteIcon onClick={() => onDelete(picture.name, picture.id)} />
                            </Tooltip>

                        </Box>
                    </Box>
                    <Typography className={styles.name}>{picture.name}</Typography>
                </Grid>
            })}
        </Grid>
    )
}

export default React.memo(PictureGridMode);