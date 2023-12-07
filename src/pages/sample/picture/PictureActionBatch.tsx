import React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import GamesIcon from '@mui/icons-material/Games';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { state } from './store';

const PictureActionBatch = ({
    selectedFolders,
    selectedImages,
    openRenameDialog,
    openMoveDialog,
    formatedFolders,
    pictures,
    batchDelete
}: {
    selectedFolders: number[];
    selectedImages: number[];
    openRenameDialog: (name: string, type: 'pic' | 'folder', id: number) => void
    openMoveDialog: (data: { id: number; type: 'pic' | 'folder'; parentId: number }) => void;
    formatedFolders: state["formatedFolders"];
    pictures: state["pictures"];
    batchDelete: (data: any) => void;
}) => {
    console.log(selectedFolders, selectedImages)
    return <Stack
        sx={{ flex: 1, alignItems: 'center' }}
        direction="row"
    >
        <Typography>
            已选择{selectedImages.length}个图片，{selectedFolders.length}个文件夹
        </Typography>

        <ButtonGroup sx={{ marginLeft: 'auto' }} variant='outlined'>
            {
                selectedFolders.length && !selectedImages.length ? (
                    [
                        selectedFolders.length === 1 ? <Button
                            startIcon={<DriveFileRenameOutlineIcon />}
                            onClick={() => {
                                const folder = formatedFolders[selectedFolders[0]];
                                openRenameDialog(folder.name, 'folder', selectedFolders[0])
                            }}
                        >重命名</Button> : null,
                        <Button
                            startIcon={<DeleteOutlineIcon />}
                            onClick={() => batchDelete({ folderIds: selectedFolders })}
                        >删除</Button>,
                        <Button
                            startIcon={<GamesIcon />}
                        >移动</Button>
                    ]
                ) : null
            }
            {
                !selectedFolders.length && selectedImages.length ? (
                    [
                        selectedImages.length === 1 ? <Button
                            startIcon={<DriveFileRenameOutlineIcon />}
                            onClick={() => {
                                const picture = pictures.find(p => p.id === selectedImages[0]);
                                openRenameDialog(picture.name, 'pic', selectedImages[0])
                            }}
                        >重命名</Button> : null,
                        <Button
                            startIcon={<DeleteOutlineIcon />}
                            onClick={() => batchDelete({ pictureIds: selectedImages })}
                        >删除</Button>,
                        <Button
                            startIcon={<GamesIcon />}
                        >移动</Button>
                    ]
                ) : null
            }
            {
                selectedFolders.length && selectedImages.length ? (
                    [
                        <Button
                            startIcon={<DeleteOutlineIcon />}
                            onClick={() => batchDelete({ folderIds: selectedFolders, pictureIds: selectedImages })}
                        >删除</Button>,
                        <Button
                            startIcon={<GamesIcon />}
                        >移动</Button>
                    ]
                ) : null
            }
        </ButtonGroup>
    </Stack>

}

export default React.memo(PictureActionBatch);
