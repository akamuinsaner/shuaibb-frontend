import React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import GamesIcon from '@mui/icons-material/Games';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { state } from './store';
import { PictureInfo } from 'declare/picture';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { message } from 'components/globalMessage';

const PictureActionBatch = ({
    selectedFolders,
    selectedImages,
    openRenameDialog,
    openMoveDialog,
    formatedFolders,
    pictures,
    batchDelete,
    openBatchMoveDialog,
    openEditDialog

}: {
    selectedFolders: number[];
    selectedImages: number[];
    openRenameDialog: (name: string, type: 'pic' | 'folder', id: number) => void
    openMoveDialog: (data: { id: number; type: 'pic' | 'folder'; parentId: number }) => void;
    formatedFolders: state["formatedFolders"];
    pictures: state["pictures"];
    batchDelete: (data: any) => void;
    openBatchMoveDialog: (data: any) => void;
    openEditDialog: (info: PictureInfo) => void
}) => {
    const [copyPicture, setCopyPicture] = React.useState<PictureInfo>(null);
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
                            key="rename-1"
                            startIcon={<DriveFileRenameOutlineIcon />}
                            onClick={() => {
                                const folder = formatedFolders[selectedFolders[0]];
                                openRenameDialog(folder.name, 'folder', selectedFolders[0])
                            }}
                        >重命名</Button> : null,
                        <Button
                            key="delete-1"
                            startIcon={<DeleteOutlineIcon />}
                            onClick={() => batchDelete({ folderIds: selectedFolders })}
                        >删除</Button>,
                        <Button
                            key="move-1"
                            startIcon={<GamesIcon />}
                            onClick={() => openBatchMoveDialog({
                                folderIds: selectedFolders,
                            })}
                        >移动</Button>
                    ]
                ) : null
            }
            {
                !selectedFolders.length && selectedImages.length ? (
                    [
                        selectedImages.length === 1 ? <>
                            <Button
                                key="rename-2"
                                startIcon={<DriveFileRenameOutlineIcon />}
                                onClick={() => {
                                    const picture = pictures.find(p => p.id === selectedImages[0]);
                                    openRenameDialog(picture.name, 'pic', selectedImages[0])
                                }}
                            >重命名</Button>
                            <Button
                                key="edit-2"
                                startIcon={<BorderColorIcon />}
                                onClick={() => {
                                    const picture = pictures.find(p => p.id === selectedImages[0]);
                                    openEditDialog(picture)
                                }}
                            >
                                编辑
                            </Button>
                            <PopupState variant="popover" popupId="demo-popup-menu">
                                {(popupState: any) => {
                                    return (
                                        <React.Fragment>
                                            <Button
                                                key="copy-2"
                                                startIcon={<ContentCopyIcon />}
                                                endIcon={<KeyboardArrowDownIcon />}
                                                onClick={(e) => {
                                                    const picture = pictures.find(p => p.id === selectedImages[0]);
                                                    setCopyPicture(picture)
                                                    bindTrigger(popupState).onClick(e);
                                                }}
                                            >
                                                复制
                                            </Button>
                                            <Menu {...bindMenu(popupState)}>
                                                <MenuItem onClick={() => {
                                                    navigator.clipboard.writeText(copyPicture.url)
                                                    message.success('复制成功')
                                                    popupState.close()
                                                }}>复制链接</MenuItem>
                                                <MenuItem onClick={() => {
                                                    navigator.clipboard.writeText(`<img src=${copyPicture.url} />`)
                                                    message.success('复制成功')
                                                    popupState.close()
                                                }}>复制代码</MenuItem>
                                            </Menu>
                                        </React.Fragment>
                                    )
                                }}
                            </PopupState>

                        </> : null,
                        <Button
                            key="delete-2"
                            startIcon={<DeleteOutlineIcon />}
                            onClick={() => batchDelete({ pictureIds: selectedImages })}
                        >删除</Button>,
                        <Button
                            key="move-2"
                            startIcon={<GamesIcon />}
                            onClick={() => openBatchMoveDialog({
                                pictureIds: selectedImages,
                            })}
                        >移动</Button>
                    ]
                ) : null
            }
            {
                selectedFolders.length && selectedImages.length ? (
                    [
                        <Button
                            key="delete-3"
                            startIcon={<DeleteOutlineIcon />}
                            onClick={() => batchDelete({ folderIds: selectedFolders, pictureIds: selectedImages })}
                        >删除</Button>,
                        <Button
                            key="move-3"
                            startIcon={<GamesIcon />}
                            onClick={() => openBatchMoveDialog({
                                pictureIds: selectedImages,
                                folderIds: selectedFolders,
                            })}
                        >移动</Button>
                    ]
                ) : null
            }
        </ButtonGroup>
    </Stack>

}

export default React.memo(PictureActionBatch);
